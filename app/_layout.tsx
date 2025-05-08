import { AuthProvider } from "@/context/authContext/authContext";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
        <Stack screenOptions={{ headerShown: false }}>
          <AuthProvider>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(app)" />
          </AuthProvider>
        </Stack>
  );
}
