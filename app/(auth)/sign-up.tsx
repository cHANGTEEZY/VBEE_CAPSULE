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
import { useSignUp, useAuth } from "@clerk/clerk-expo";
import { COLORS } from "@/utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import OTPInput from "@/components/OTPInput";
import { useSaveUserToBackend } from "@/hooks/api/auth/saveUserToBackend";

const backgroundImage = require("../../assets/images/memories.jpg");

// Validation schema
const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { getToken } = useAuth();
  const saveUserMutation = useSaveUserToBackend();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userFullName, setUserFullName] = React.useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignUp = async (data: SignUpFormData) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      // Store user data for later use
      setUserEmail(data.email);
      setUserFullName(data.fullName);

      // Create the user
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.fullName.split(" ")[0],
        lastName: data.fullName.split(" ").slice(1).join(" ") || undefined,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code resent to your email");
      setCode(""); // Clear the current code
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyEmail = async () => {
    if (!isLoaded || code.length !== 6) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });

      // Get the Clerk user ID from the completed sign up
      const clerkUserId = completeSignUp.createdUserId;

      if (clerkUserId) {
        // Get the auth token
        const token = await getToken();

        if (token) {
          // Save user to your backend
          const userData = {
            clerkUserId: clerkUserId,
            email: userEmail,
            firstName: userFullName.split(" ")[0],
            lastName: userFullName.split(" ").slice(1).join(" ") || undefined,
            fullName: userFullName,
          };

          await saveUserMutation.mutateAsync({ userData, token });

          router.replace("/(tabs)");
        } else {
          Alert.alert("Error", "Failed to get authentication token");
        }
      } else {
        Alert.alert("Error", "Failed to get user ID");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/(tabs)",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign up with Google");
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground source={backgroundImage} resizeMode="cover" style={{ flex: 1 }}>
          <LinearGradient
            colors={[
              "rgba(248, 250, 252, 0.2)",
              "rgba(241, 245, 249, 0.2)",
              "rgba(226, 232, 240, 0.2)",
            ]}
            style={styles.gradient}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.verificationContainer}>
                <Ionicons name="mail" size={64} color={COLORS.highlight} />
                <Text style={styles.verificationTitle}>Verify Your Email</Text>
                <Text style={styles.verificationText}>
                  We've sent a 6-digit verification code to {userEmail}
                </Text>

                <View style={styles.otpContainer}>
                  <OTPInput length={6} value={code} onChangeText={setCode} disabled={isLoading} />
                </View>

                <Button
                  mode="contained"
                  onPress={onVerifyEmail}
                  loading={isLoading}
                  disabled={isLoading || code.length !== 6}
                  style={styles.verifyButton}
                  buttonColor={COLORS.buttonBg}
                  textColor={COLORS.buttonText}
                  contentStyle={styles.buttonContent}
                >
                  Verify Email
                </Button>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive the code? </Text>
                  <Pressable onPress={onResendCode} disabled={isLoading}>
                    <Text style={[styles.resendLink, isLoading && { opacity: 0.5 }]}>
                      Resend Code
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => {
                    setPendingVerification(false);
                    setCode("");
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.backText}>Back to Sign Up</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }

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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Capture moments, preserve memories, relive your story
                </Text>
              </View>

              {/* Sign Up Form */}
              <View style={styles.form}>
                {/* Full Name Input */}
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Full Name"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.fullName}
                      style={styles.input}
                      outlineStyle={{
                        borderColor: errors.fullName ? "#ff6b6b" : COLORS.borderColor,
                      }}
                      activeOutlineColor={COLORS.highlight}
                      textColor={COLORS.textPrimary}
                      autoCapitalize="words"
                      theme={{
                        colors: {
                          onSurfaceVariant: COLORS.textSecondary,
                          background: COLORS.inputBg,
                          outline: COLORS.borderColor,
                        },
                      }}
                      left={<TextInput.Icon icon="account" color={COLORS.highlight} />}
                    />
                  )}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

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

                {/* Confirm Password Input */}
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Confirm Password"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.confirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.input}
                      outlineStyle={{
                        borderColor: errors.confirmPassword ? "#ff6b6b" : COLORS.borderColor,
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
                      left={<TextInput.Icon icon="lock-check" color={COLORS.highlight} />}
                      right={
                        <TextInput.Icon
                          icon={showConfirmPassword ? "eye-off" : "eye"}
                          color={COLORS.highlight}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}

                {/* Sign Up Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSignUp)}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.signUpButton}
                  buttonColor={COLORS.buttonBg}
                  textColor={COLORS.buttonText}
                  contentStyle={styles.buttonContent}
                >
                  Sign Up
                </Button>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign Up */}
                <Button
                  mode="outlined"
                  onPress={onGoogleSignUp}
                  style={styles.googleButton}
                  textColor={"white"}
                  contentStyle={styles.buttonContent}
                  icon={() => <Ionicons name="logo-google" size={20} color={"black"} />}
                >
                  Continue with Google
                </Button>

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have an account? </Text>
                  <Pressable onPress={() => router.push("/(auth)/sign-in")}>
                    <Text style={styles.signInLink}>Sign In</Text>
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
  signUpButton: {
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signInText: {
    color: "white",
    fontSize: 18,
  },
  signInLink: {
    color: COLORS.highlight,
    fontSize: 18,
    fontWeight: "600",
  },
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  verificationTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  verificationText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpContainer: {
    width: "100%",
    marginBottom: 8,
  },
  verifyButton: {
    marginTop: 24,
    borderRadius: 8,
    width: "100%",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.highlight,
    fontSize: 14,
    fontWeight: "600",
  },
  backText: {
    color: COLORS.highlight,
    fontSize: 14,
    marginTop: 16,
  },
});
