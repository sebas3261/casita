import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import RegistroCard from "../../../components/RegistroCard";
import { useRegistros } from "../../../context/registerContext/RegisterContext";

export default function RegistrosScreen() {
  const { registros, deleteRegistro } = useRegistros();

  const handleDelete = (id: string) => {
    deleteRegistro(id).catch((e) => {
      console.error("Error eliminando registro:", e);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registro de eventos</Text>

      {!registros || registros.length === 0 ? (
        <Text style={styles.emptyText}>No hay registros aún.</Text>
      ) : (
        registros
          .sort((a, b) => b.fecha - a.fecha)
          .map((registro) => (
            <RegistroCard
              key={registro.id}
              mensaje={registro.mensaje}
              usuario={registro.usuario}
              fecha={registro.fecha}
            >
              <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={() => handleDelete(registro.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color="#e74c3c"
                />
              </TouchableOpacity>
            </RegistroCard>
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
  deleteIconButton: {
    marginLeft: 12,
    padding: 6,
  },
});
