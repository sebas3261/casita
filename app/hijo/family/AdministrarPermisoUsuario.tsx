import CustomSwitch from "@/components/ToogleSwitch"; // Ajusta la ruta
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const allFunctionalities = [
  "Lights",
  "Devices",
  "Settings",
  "Reports",
  "Admin Panel",
];

const initialUsers = [
  { id: 1, name: "Alice", permissions: ["Lights"], avatar: require("@/assets/images/user.png") },
  { id: 2, name: "Bob", permissions: ["Devices", "Reports"], avatar: require("@/assets/images/user.png") },
  { id: 3, name: "Charlie", permissions: [], avatar: require("@/assets/images/user.png") },
];

export default function UsersAccess() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const togglePermission = (perm, newValue) => {
    if (!selectedUser) return;

    const updatedPermissions = newValue
      ? [...selectedUser.permissions, perm]
      : selectedUser.permissions.filter((p) => p !== perm);

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUserId
          ? { ...user, permissions: updatedPermissions }
          : user
      )
    );
  };

  const savePermissions = () => {
    if (!selectedUser) return;
    // Aquí puedes conectar con API para guardar
    Alert.alert(
      "Permissions Saved",
      `Permisos para ${selectedUser.name} guardados:\n${selectedUser.permissions.join(", ")}`,
    );
  };

  return (
    <View style={styles.container}>
      {/* Lista de Usuarios */}
      <View style={styles.usersList}>
        <Text style={styles.title}>Users</Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userItem,
                selectedUserId === user.id && styles.userItemSelected,
              ]}
              onPress={() => setSelectedUserId(user.id)}
            >
              <Image source={user.avatar} style={styles.avatar} />
              <Text
                style={[
                  styles.userName,
                  selectedUserId === user.id && { color: "#fff" },
                ]}
              >
                {user.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Panel de funcionalidades para el usuario seleccionado */}
      {selectedUser ? (
        <>
          <View style={styles.permissionsPanel}>
            <Text style={styles.title}>Permissions for {selectedUser.name}</Text>
            {allFunctionalities.map((func) => {
              const hasPermission = selectedUser.permissions.includes(func);
              return (
                <View key={func} style={styles.permissionRow}>
                  <Text style={styles.permissionText}>{func}</Text>
                  <CustomSwitch
                    value={hasPermission}
                    onValueChange={(val) => togglePermission(func, val)}
                  />
                  
                </View>
                
              );
            })}
             {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={savePermissions}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          </View>

         
        </>
      ) : (
        <View style={styles.permissionsPanel}>
          <Text style={{ fontStyle: "italic", color: "#555" }}>
            Select a user to assign permissions
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f6f7fa",
  },
  usersList: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  userItemSelected: {
    backgroundColor: "#985EE1",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  permissionsPanel: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#e9ebf0",
  },
  permissionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: "#985EE1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
