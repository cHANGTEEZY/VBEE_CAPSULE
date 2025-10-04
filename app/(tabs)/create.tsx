import CreateBar from "@/features/create/components/CreateBar";
import { COLORS } from "@/utils/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

const Create = () => {
  const [pickedImage, setPickedImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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

  const handleCapture = () => {};

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, color: "white" }}>Add new story</Text>

      <View style={styles.barContainer}>
        <CreateBar
          barText="Add from Gallery"
          iconName="image"
          textSize={17}
          size={20}
          color="#646772"
          onPress={handleAddFromGallery}
          isLoading={isLoading}
        />
        <CreateBar
          barText="Add Journal"
          iconName="pencil"
          textSize={17}
          size={20}
          color="#646772"
        />
        <CreateBar
          barText="Capture"
          iconName="camera"
          textSize={17}
          size={20}
          color="#646772"
          onPress={handleCapture}
        />
      </View>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 20,
  },
  barContainer: {
    alignItems: "center",
  },
});
