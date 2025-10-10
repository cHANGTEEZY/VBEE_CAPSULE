import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenHeight, ScreenWidth } from "@/utils/dimensions";
import Loader from "@/components/Loader";
import { GlassView } from "expo-glass-effect";
import { COLORS } from "@/utils/colors";

type CreateBarProps = {
  barText: string;
  iconName: keyof typeof Ionicons.glyphMap;
  size: number;
  textSize: number;
  color: string;
  onPress?: () => void;
  isLoading?: boolean;
  width?: string | number;
};

const CreateBar = ({
  barText,
  iconName,
  size,
  textSize,
  color,
  onPress,
  isLoading,
  width = "100%",
}: CreateBarProps) => {
  return (
    <Pressable disabled={isLoading} onPress={onPress} style={[styles.container, { width }]}>
      <GlassView
        style={[
          styles.barContainer,
          {
            backgroundColor: "transparent",
          },
        ]}
        glassEffectStyle="regular"
      >
        {isLoading ? (
          <>
            <Loader size="small" color={COLORS.buttonBg} />
          </>
        ) : (
          <>
            <Text style={[{ fontSize: textSize, color }, styles.textStyles]}>{barText}</Text>
            <Ionicons name={iconName} size={size} color={color} />
          </>
        )}
      </GlassView>
    </Pressable>
  );
};

export default CreateBar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
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
    width: "100%",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },

  textStyles: {
    fontWeight: "500",
  },
});
