// app/AdminPanel.js
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminPanel() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("./family/AdministrarPermisoUsuario")}
      >
        <Text style={styles.optionText}>Administrar Permisos de Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => alert("Otra opción")}
      >
        <Text style={styles.optionText}>Configuración del Sistema</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => alert("Otra opción")}
      >
        <Text style={styles.optionText}>Reportes</Text>
      </TouchableOpacity>

      {/* Agrega más opciones aquí */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f6f7fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: "#985EE1",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
