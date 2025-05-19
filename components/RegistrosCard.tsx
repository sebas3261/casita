import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  mensaje: string;
  usuario: string;
  fecha: number;
}

const getIcon = (mensaje: string) => {
  if (mensaje.toLowerCase().includes("led")) {
    return <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#f5c518" />;
  } else if (mensaje.toLowerCase().includes("abrir") || mensaje.toLowerCase().includes("cerrar") || mensaje.toLowerCase().includes("door")) {
    return <MaterialCommunityIcons name="door" size={28} color="#4a90e2" />;
  } else if (mensaje.toLowerCase().includes("login") || mensaje.toLowerCase().includes("entró") || mensaje.toLowerCase().includes("inició sesión")) {
    return <MaterialCommunityIcons name="login" size={28} color="#50e3c2" />;
  } else if (mensaje.toLowerCase().includes("cerró sesión")) {
    return <MaterialCommunityIcons name="logout" size={28} color="#ff4d4d" />;
  } else if (mensaje.toLowerCase().includes("movimiento")) {
    return <MaterialCommunityIcons name="run-fast" size={28} color="#ff9900" />;
  } else {
    return <MaterialCommunityIcons name="information-outline" size={28} color="#aaa" />;
  }
};

const RegistroCard = ({ mensaje, usuario, fecha }: Props) => {
  const date = new Date(fecha).toLocaleString();

  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        {getIcon(mensaje)}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{mensaje}</Text>
        <Text style={styles.subtitle}>By {usuario} - {date}</Text>
      </View>
    </View>
  );
};

export default RegistroCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f4f8",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
