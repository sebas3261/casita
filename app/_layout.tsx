import { AuthProvider } from "@/context/authContext/authContext";
import { DataProvider } from "@/context/dataContext/dataContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
        </Stack>
      </DataProvider>
    </AuthProvider>
  );
}
