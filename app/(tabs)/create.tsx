import React from "react";
import CreateBar from "@/features/create/components/CreateBar";
import { COLORS } from "@/utils/colors";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MemoryForm from "@/features/create/components/MemoryForm";

const Create = () => {
  const params = useLocalSearchParams<{ photoUri?: string }>();
  const [pickedImage, setPickedImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    if (params.photoUri) {
      setPickedImage(params.photoUri);
      router.setParams({ photoUri: undefined });
    }
  }, [params.photoUri]);

  const handleAddFromGallery = async () => {
    setIsLoading(true);
    const content = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!content.canceled) {
      setPickedImage(content.assets[0].uri);
    }
    setIsLoading(false);
  };

  const handleCapture = async () => {
    if (!permission) {
      return Alert.alert(
        "Camera permission not granted",
        "Please grant camera permission from settings to use this feature"
      );
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return Alert.alert(
          "Permission denied",
          "Camera permission is required to use this feature"
        );
      }
    }

    router.push({
      pathname: "/camera",
      params: { returnTo: "/(tabs)/create" },
    } as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={[
          COLORS.primaryGradientColor1,
          COLORS.primaryGradientColor2,
          COLORS.secondaryGradientColor1,
        ]}
        style={styles.flex1}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, marginTop: 20 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          >
            <Text style={styles.header}>Create a Memory</Text>

            <View style={styles.imageContainer}>
              {pickedImage ? (
                <View style={styles.imagePreview}>
                  <Pressable style={styles.closeButton} onPress={() => setPickedImage(null)}>
                    <Ionicons name="close" size={22} color={COLORS.buttonText} />
                  </Pressable>

                  <Image source={{ uri: pickedImage }} style={styles.image} />
                </View>
              ) : (
                <View style={styles.imagePreview}>
                  <Ionicons
                    name="image-outline"
                    size={200}
                    style={styles.image}
                    color={COLORS.textMuted}
                  />
                </View>
              )}
            </View>

            <View style={styles.barContainer}>
              <CreateBar
                barText="Add from Gallery"
                iconName="image"
                textSize={17}
                size={20}
                color={COLORS.textPrimary}
                onPress={handleAddFromGallery}
                isLoading={isLoading}
                width="48%"
              />
              <CreateBar
                barText="Capture"
                iconName="camera"
                textSize={17}
                size={20}
                color={COLORS.textPrimary}
                onPress={handleCapture}
                width="48%"
              />
            </View>

            <View>
              <MemoryForm
                onSubmit={(data) => {
                  console.log("Memory Form Data:", data);
                  Alert.alert("Success", "Memory saved successfully!");
                  // TODO: Save to database/storage
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
  },
  flex1: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  barContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },

  imagePreview: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    width: 220,
    height: 260,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
  imageText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
});
