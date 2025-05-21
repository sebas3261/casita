import { useAuth } from "@/context/authContext/authContext";
import colors from "@/styles/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const roles = [
  { label: "Papá", value: "papá", icon: "account-tie" },
  { label: "Mamá", value: "mamá", icon: "account-heart" },
  { label: "Hijo", value: "hijo", icon: "account-child" },
];

export default function AuthScreen() {
  const { signup, login, userRole } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup states
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "papá":
        router.replace("./papa/home");
        break;
      case "mamá":
        router.replace("./mama/home");
        break;
      case "hijo":
        router.replace("./hijo/home");
        break;
      
      default:
        router.replace("./");
    }
  };

  // Pick image from camera
  // Pick image from camera
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso para usar cámara denegado');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        await AsyncStorage.setItem('localPhotoUri', uri);
      };
    }
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("userRole cambiado:", userRole);
    if (userRole) {
      redirectByRole(userRole);
    }
  }, [userRole]);
  

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      alert("Por favor completa todos los campos y selecciona un rol");
      return;
    }
    setLoading(true);
    try {
      await signup(signupEmail, signupPassword, {
        name: signupName,
        role: signupRole,
      }, photoUri ?? undefined);
      redirectByRole(signupRole);
    } catch (error) {
      console.error("Error en signup:", error);
      alert("Error al crear usuario. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.black} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : isLogin ? (
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={loginEmail}
            onChangeText={setLoginEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.toggleContainer}>
            <Text style={styles.text}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => setIsLogin(false)}>
              <Text style={styles.link}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={signupName}
            onChangeText={setSignupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={signupEmail}
            onChangeText={setSignupEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={signupPassword}
            onChangeText={setSignupPassword}
          />

          <Text style={styles.roleLabel}>Select Role</Text>
          <View style={styles.rolesContainer}>
            {roles.map(({ label, value, icon }) => {
              const selected = signupRole === value;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setSignupRole(value)}
                  activeOpacity={0.7}
                  style={{ borderRadius: 10, marginHorizontal: 4, overflow: "hidden" }}
                >
                  {selected ? (
                    <LinearGradient
                      colors={["#985EE1", "#F25656"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.roleButtonSelected, { padding: 10, alignItems: "center" }]}
                    >
                      <MaterialCommunityIcons name={icon} size={30} color={colors.white} />
                      <Text style={[styles.roleText, { color: colors.white, marginTop: 6 }]}>
                        {label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.roleButton, { padding: 10, alignItems: "center" }]}>
                      <MaterialCommunityIcons name={icon} size={30} color={colors.grayMedium} />
                      <Text style={styles.roleText}>{label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#4a90e2" }]} onPress={pickImage}>
            <Text style={styles.buttonText}>Tomar foto</Text>
          </TouchableOpacity>

          {photoUri && (
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Text>Foto seleccionada:</Text>
              <Image source={{ uri: photoUri }} style={{ width: 120, height: 120, borderRadius: 8 }} />
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.text}>Already have an account?</Text>
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: colors.black,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  button: {
    backgroundColor: colors.black,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  text: {
    fontSize: 15,
    color: "#555",
  },
  link: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "600",
  },
  roleLabel: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
    color: colors.black,
  },
  rolesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  roleButton: {
    alignItems: "center",
    padding: 10,
  },
  roleButtonSelected: {
    borderRadius: 10,
  },
  roleText: {
    marginTop: 6,
    fontSize: 14,
    color: colors.grayMedium,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.black,
  },
});