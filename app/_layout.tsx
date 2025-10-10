import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="camera"
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
              contentStyle: { backgroundColor: "black" },
            }}
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
