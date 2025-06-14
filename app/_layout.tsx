import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "@/store/settingsStore";
import { colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { isDarkMode, hasCompletedOnboarding } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerBackTitle: "Back",
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        {!hasCompletedOnboarding ? (
          <>
            <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/features" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/notifications" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/goals" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/complete" options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="quote/[id]" 
              options={{ 
                title: "Quote",
                headerTransparent: true,
                headerTintColor: "#FFFFFF",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="category/[id]" 
              options={{ 
                title: "Category",
                headerBackTitle: "Categories",
              }} 
            />
          </>
        )}
      </Stack>
    </>
  );
}