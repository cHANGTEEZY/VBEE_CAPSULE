import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { COLORS } from "@/utils/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

// Zod schema for memory form validation
const memorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  location: z.string().optional(),
  date: z.date(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

type MemoryFormProps = {
  onSubmit: (data: MemoryFormData) => void;
  initialValues?: Partial<MemoryFormData>;
};

const MemoryForm = ({ onSubmit, initialValues }: MemoryFormProps) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      location: initialValues?.location || "",
      date: initialValues?.date || new Date(),
      tags: initialValues?.tags || "",
      notes: initialValues?.notes || "",
    },
  });

  const selectedDate = watch("date");

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* Title Input */}
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Title *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.title}
            style={styles.input}
            outlineStyle={{ borderColor: errors.title ? "#ff6b6b" : "#646772" }}
            activeOutlineColor="#BFCFE7"
            textColor="#ffffff"
            // selectionColor=":"

            theme={{
              colors: {
                onSurfaceVariant: "#a0a0a0",
                background: "rgba(0,0,0,0.7)",
                outline: "black",
              },
            }}
            placeholder="Give your memory a title"
            placeholderTextColor="#7d8797"
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      {/* Description Input */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.description}
            style={styles.input}
            outlineStyle={{ borderColor: errors.description ? "#ff6b6b" : "#646772" }}
            activeOutlineColor="#BFCFE7"
            textColor="#ffffff"
            multiline
            numberOfLines={4}
            theme={{
              colors: {
                onSurfaceVariant: "#a0a0a0",
                background: "rgba(0,0,0,0.7)",
                outline: "black",
              },
            }}
            placeholder="Describe your memory"
            placeholderTextColor="#7d8797"
          />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      {/* Location Input */}
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Location"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.input}
            outlineStyle={{ borderColor: "#646772" }}
            activeOutlineColor="#BFCFE7"
            textColor="#ffffff"
            theme={{
              colors: {
                onSurfaceVariant: "#a0a0a0",
                background: "rgba(0,0,0,0.7)",
                outline: "black",
              },
            }}
            placeholder="Where did this happen?"
            placeholderTextColor="#7d8797"
            left={<TextInput.Icon icon="map-marker" color="#BFCFE7" />}
          />
        )}
      />

      {/* Date Picker */}
      <Controller
        control={control}
        name="date"
        render={({ field: { value } }) => (
          <View>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                label="Date *"
                mode="outlined"
                value={formatDate(value)}
                editable={false}
                style={styles.input}
                outlineStyle={{ borderColor: "#646772" }}
                activeOutlineColor="#BFCFE7"
                textColor="#ffffff"
                theme={{
                  colors: {
                    onSurfaceVariant: "#a0a0a0",
                    background: "rgba(0,0,0,0.7)",
                    outline: "black",
                  },
                }}
                left={<TextInput.Icon icon="calendar" color="#BFCFE7" />}
                right={<TextInput.Icon icon="chevron-down" color="#BFCFE7" />}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
      />
      {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

      {/* Tags Input */}
      <Controller
        control={control}
        name="tags"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Tags"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.input}
            outlineStyle={{ borderColor: "#646772" }}
            activeOutlineColor="#BFCFE7"
            textColor="#ffffff"
            theme={{
              colors: {
                onSurfaceVariant: "#a0a0a0",
                background: "rgba(0,0,0,0.7)",
                outline: "black",
              },
            }}
            placeholder="e.g., family, vacation, birthday"
            placeholderTextColor="#7d8797"
            left={<TextInput.Icon icon="tag-multiple" color="#BFCFE7" />}
          />
        )}
      />

      {/* Notes Input */}
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Additional Notes"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.input}
            outlineStyle={{ borderColor: "#646772" }}
            activeOutlineColor="#BFCFE7"
            textColor="#ffffff"
            multiline
            numberOfLines={3}
            theme={{
              colors: {
                onSurfaceVariant: "#a0a0a0",
                background: "rgba(0,0,0,0.7)",
                outline: "black",
              },
            }}
            placeholder="Any additional thoughts or details"
            placeholderTextColor="#7d8797"
          />
        )}
      />

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
        buttonColor="#BFCFE7"
        textColor="#000000"
        contentStyle={styles.submitButtonContent}
      >
        Save Memory
      </Button>
    </View>
  );
};

export default MemoryForm;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: "transparent",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: -8,
    marginLeft: 12,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
