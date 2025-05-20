import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  mensaje: string;
  usuario: string;
  fecha: number;
  children?: ReactNode; // Aquí se acepta contenido extra opcional
}

const getIcon = (mensaje: string) => {
  const msg = mensaje.toLowerCase();
  if (msg.includes("led")) {
    return <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#f5c518" />;
  } else if (msg.includes("abrir") || msg.includes("cerrar") || msg.includes("door")) {
    return <MaterialCommunityIcons name="door" size={28} color="#4a90e2" />;
  } else if (msg.includes("login") || msg.includes("entró") || msg.includes("inició sesión")) {
    return <MaterialCommunityIcons name="login" size={28} color="#50e3c2" />;
  } else if (msg.includes("cerró sesión")) {
    return <MaterialCommunityIcons name="logout" size={28} color="#ff4d4d" />;
  } else if (msg.includes("movimiento")) {
    return <MaterialCommunityIcons name="run-fast" size={28} color="#ff9900" />;
  } else {
    return <MaterialCommunityIcons name="information-outline" size={28} color="#aaa" />;
  }
};

const RegistroCard = ({ mensaje, usuario, fecha, children }: Props) => {
  const date = new Date(fecha).toLocaleString();

  return (
    <View style={styles.card}>
      <View style={styles.icon}>{getIcon(mensaje)}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{mensaje}</Text>
        <Text style={styles.subtitle}>By {usuario} - {date}</Text>
      </View>
      {/* Aquí mostramos el contenido extra, por ejemplo botón eliminar */}
      {children && <View style={styles.actions}>{children}</View>}
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
  actions: {
    marginLeft: 12,
  },
});
