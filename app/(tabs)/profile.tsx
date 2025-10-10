import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const { signOut, isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  return (
    <View style={styles.container}>
      <Text>Profile</Text>

      <Pressable onPress={() => signOut()} style={{ marginTop: 20 }}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
