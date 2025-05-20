import { AuthContext } from "@/context/authContext/authContext";
import colors from "@/styles/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const roles = [
  { label: "Papá", value: "papá", icon: "account-tie" },
  { label: "Mamá", value: "mamá", icon: "account-heart" },
  { label: "Hijo", value: "hijo", icon: "account-child" },
  { label: "Otro", value: "otro", icon: "account" },
];

export default function AuthScreen() {
  const { signup, login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState("papá"); // valor por defecto

  // Función para redirigir según rol
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
      case "otro":
        router.replace("./otro/home");
        break;
      default:
        router.replace("./");
    }
  };

  const handleLogin = async () => {
    try {
      await login(loginEmail, loginPassword);

      redirectByRole(signupRole); //
      console.log("Login exitoso");
    } catch (error) {
      console.log("Error en login:", error);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(signupEmail, signupPassword, { name: signupName, role: signupRole });
      redirectByRole(signupRole); // redirigir según rol tras signup
      console.log("Usuario creado");
    } catch (error) {
      console.log("Error en signup:", error);
    }
  };

  return (
      <View style={styles.container}>
        {isLogin ? (
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

            {/* Radio Buttons con íconos y degradado en botón seleccionado */}
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
                        <MaterialCommunityIcons
                          name={icon}
                          size={30}
                          color={colors.white}
                        />
                        <Text style={[styles.roleText, { color: colors.white, marginTop: 6 }]}>
                          {label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={[styles.roleButton, { padding: 10, alignItems: "center" }]}>
                        <MaterialCommunityIcons
                          name={icon}
                          size={30}
                          color={colors.grayMedium}
                        />
                        <Text style={styles.roleText}>{label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

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
});
