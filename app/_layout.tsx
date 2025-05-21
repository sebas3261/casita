import { AuthProvider } from "@/context/authContext/authContext";
import { DoorsProvider } from "@/context/doorsContext/DoorsContext";
import { LedProvider } from "@/context/ledsContext/LedsContext";
import { RegistrosProvider } from "@/context/registerContext/RegisterContext";
import { SensoresProvider } from "@/context/sensoresContext.tsx/SensoresContext";
import { UsersProvider } from "@/context/usersContext/UsersContext";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <AuthProvider>
        <LedProvider>
        <DoorsProvider>
          <SensoresProvider>
            <RegistrosProvider>
              <UsersProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="main" />
        </Stack>
        </UsersProvider>
            </RegistrosProvider>
        </SensoresProvider>
        </DoorsProvider>
        </LedProvider>
    </AuthProvider>
  );
}
