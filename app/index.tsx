import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { COLORS } from "@/utils/colors";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.primaryBg,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.highlight} />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Redirect href={"/(auth)/sign-in"} />;
}
