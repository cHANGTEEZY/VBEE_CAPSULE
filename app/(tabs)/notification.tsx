import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Notification = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Notification</Text>

      <Pressable onPress={() => signOut()} style={{ marginTop: 20 }}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
