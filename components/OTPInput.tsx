import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Platform } from "react-native";
import { COLORS } from "@/utils/colors";

type OTPInputProps = {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
};

const OTPInput = ({ length = 6, value, onChangeText, disabled = false }: OTPInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hiddenInputRef = useRef<TextInput | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Split the value into individual digits
  const digits = value.split("");

  // Handle iOS autofill
  const handleHiddenInputChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, "").slice(0, length);
    onChangeText(sanitized);

    // Focus the next empty input or the last one
    if (sanitized.length < length) {
      inputRefs.current[sanitized.length]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    const sanitized = text.replace(/[^0-9]/g, "");

    if (sanitized.length === 0) {
      // Handle backspace
      const newValue = digits.filter((_, i) => i !== index).join("");
      onChangeText(newValue);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (sanitized.length === 1) {
      // Single digit input
      const newDigits = [...digits];
      newDigits[index] = sanitized;
      onChangeText(newDigits.join(""));
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (sanitized.length > 1) {
      // Pasted multiple digits (from iOS autofill or clipboard)
      handleHiddenInputChange(sanitized);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && digits[index] === undefined && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <View style={styles.container}>
      {/* Hidden input for iOS autofill - positioned off-screen */}
      {Platform.OS === "ios" && (
        <TextInput
          ref={hiddenInputRef}
          style={styles.hiddenInput}
          value={value}
          onChangeText={handleHiddenInputChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={length}
          editable={!disabled}
        />
      )}

      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] || "";
        const isFocused = focusedIndex === index;

        return (
          <Pressable key={index} onPress={() => handlePress(index)} style={styles.inputWrapper}>
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.input,
                isFocused && styles.inputFocused,
                digit !== "" && styles.inputFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
              textAlign="center"
              autoComplete="off"
              textContentType="none"
              autoCorrect={false}
              caretHidden={false}
              contextMenuHidden={true}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
    left: -9999,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 4,
    maxWidth: 50,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.textPrimary,
    backgroundColor: COLORS.inputBg,
    textAlign: "center",
  },
  inputFocused: {
    borderColor: COLORS.highlight,
    borderWidth: 2.5,
    backgroundColor: COLORS.primaryBg,
  },
  inputFilled: {
    borderColor: COLORS.highlight,
    backgroundColor: COLORS.primaryBg,
  },
});
