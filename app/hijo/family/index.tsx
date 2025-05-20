import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import RegistroCard from "../../../components/RegistroCard"; // Ajusta nombre y ruta correcta
import { useRegistros } from "../../../context/registerContext/RegisterContext";

export default function RegistrosPuertaPrincipalScreen() {
  const { registros } = useRegistros();

  // Filtrar registros que contienen "abrir principal" (case insensitive)
  const registrosFiltrados = registros.filter(registro =>
    registro.mensaje.toLowerCase().includes("abrir principal")
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registros: Abrir puerta principal</Text>

      {(!registrosFiltrados || registrosFiltrados.length === 0) ? (
        <Text style={styles.emptyText}>No hay registros para esta acción.</Text>
      ) : (
        registrosFiltrados
          .sort((a, b) => b.fecha - a.fecha) // orden descendente por fecha
          .map((registro) => (
            <RegistroCard
              key={registro.id}
              mensaje={registro.mensaje}
              usuario={registro.usuario}
              fecha={registro.fecha}
            />
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f7fa",
    flex: 1,
  },
  header: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#999",
  },
});
