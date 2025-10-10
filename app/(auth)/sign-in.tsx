import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { COLORS } from "@/utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const backgroundImage = require("../../assets/images/memory.jpg");

// Validation schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/(tabs)",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in with Google");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground source={backgroundImage} resizeMode="cover" style={{ flex: 1 }}>
        <LinearGradient
          colors={["rgba(4, 5, 5, 0.3)", "rgba(66, 67, 69, 0.3)", "rgba(6, 27, 60, 0.3)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Your memories are waiting to be rediscovered</Text>
              </View>

              {/* Sign In Form */}
              <View style={styles.form}>
                {/* Email Input */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Email"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.email}
                      style={styles.input}
                      outlineStyle={{ borderColor: errors.email ? "#ff6b6b" : COLORS.borderColor }}
                      activeOutlineColor={COLORS.highlight}
                      textColor={COLORS.textPrimary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      theme={{
                        colors: {
                          onSurfaceVariant: COLORS.textSecondary,
                          background: COLORS.inputBg,
                          outline: COLORS.borderColor,
                        },
                      }}
                      left={<TextInput.Icon icon="email" color={COLORS.highlight} />}
                    />
                  )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {/* Password Input */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Password"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.password}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      outlineStyle={{
                        borderColor: errors.password ? "#ff6b6b" : COLORS.borderColor,
                      }}
                      activeOutlineColor={COLORS.highlight}
                      textColor={COLORS.textPrimary}
                      theme={{
                        colors: {
                          onSurfaceVariant: COLORS.textSecondary,
                          background: COLORS.inputBg,
                          outline: COLORS.borderColor,
                        },
                      }}
                      left={<TextInput.Icon icon="lock" color={COLORS.highlight} />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          color={COLORS.highlight}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {/* Forgot Password */}
                <Pressable onPress={() => Alert.alert("Info", "Password reset coming soon!")}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Pressable>

                {/* Sign In Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSignIn)}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.signInButton}
                  buttonColor={COLORS.buttonBg}
                  textColor={COLORS.buttonText}
                  contentStyle={styles.buttonContent}
                >
                  Sign In
                </Button>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <Button
                  mode="outlined"
                  onPress={onGoogleSignIn}
                  style={styles.googleButton}
                  textColor={"white"}
                  contentStyle={styles.buttonContent}
                  icon={() => <Ionicons name="logo-google" size={20} color={"black"} />}
                >
                  Continue with Google
                </Button>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(224, 225, 225, 1)",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.inputBg,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: -12,
    marginLeft: 12,
  },
  forgotPassword: {
    color: COLORS.highlight,
    fontSize: 14,
    textAlign: "right",
    marginTop: -8,
  },
  signInButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderColor,
  },
  dividerText: {
    color: COLORS.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    borderColor: COLORS.borderColor,
    borderRadius: 8,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signUpText: {
    color: "white",
    fontSize: 18,
  },
  signUpLink: {
    color: COLORS.highlight,
    fontSize: 18,
    fontWeight: "600",
  },
});
