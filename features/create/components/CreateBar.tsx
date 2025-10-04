import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenHeight, ScreenWidth } from "@/utils/dimensions";

type CreateBarProps = {
  barText: string;
  iconName: keyof typeof Ionicons.glyphMap;
  size: number;
  textSize: number;
  color: string;
  onPress?: () => void;
  isLoading?: boolean;
};

const CreateBar = ({
  barText,
  iconName,
  size,
  textSize,
  color,
  onPress,
  isLoading,
}: CreateBarProps) => {
  return (
    <Pressable disabled={isLoading} onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: isLoading ? "#7d8797ff" : "#BFCFE7",
          },
        ]}
      >
        <Text style={[{ fontSize: textSize }, styles.textStyles]}>
          {barText}
        </Text>
        <Ionicons name={iconName} size={size} color={color} />
      </View>
    </Pressable>
  );
};

export default CreateBar;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth * 1.0,
    paddingHorizontal: 20,
  },

  barContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    height: ScreenHeight * 0.06,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },

  textStyles: {
    color: "#646772",
    fontWeight: "500",
  },
});
