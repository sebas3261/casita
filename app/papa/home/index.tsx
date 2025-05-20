import CustomSwitch from "@/components/ToogleSwitch";
import colors from "@/styles/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../context/authContext/authContext"; // Asegúrate de que la ruta sea correcta
import { DoorsProvider, useDoorsContext } from "../../../context/doorsContext/DoorsContext";
import { LedProvider, useLedContext } from "../../../context/ledsContext/LedsContext";
import { useSensoresContext } from "../../../context/sensoresContext.tsx/SensoresContext";

import { Modal, Pressable } from "react-native";



export default function HomeWrapper() {
  // Envuelvo Home con ambos Providers para poder usar ambos contextos
  return (
    <DoorsProvider>
      <LedProvider>
        <Home />
      </LedProvider>
    </DoorsProvider>
  );
}

function Home() {
  const [selectedTab, setSelectedTab] = useState("Doors");

  // Context para puertas
  const { doors, setDoorState } = useDoorsContext();

  // Context para luces
  const { leds, setLedState } = useLedContext();
  const { sensores } = useSensoresContext();
  const { userName } = useAuth();
  const capitalizedUserName =
  userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
  const [modalVisible, setModalVisible] = useState(false);


  const getWeatherDetails = (temp: number) => {
    if (temp <= 5) return "❄️ Cold   H:6°  L:-2°";
    if (temp > 5 && temp <= 15) return "🌤️ Partly Cloudy   H:17°  L:5°";
    if (temp > 15 && temp <= 25) return "☀️ Sunny   H:26°  L:15°";
    if (temp > 25) return "🔥 Hot   H:33°  L:20°";
    return "🌤️ Partly Cloudy   H:17°  L:5°"; // default
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <Text style={styles.title}>
  Welcome, {capitalizedUserName}
</Text>
        <Image
          // source={require("@/assets/settings.png")}
          style={styles.settingsIcon}
        />
      </View>

      {/* Family Members */}
      <View style={styles.familySection}>
        <View style={styles.familyHeaderRow}>
          <Text style={styles.subtitle}>Family Members</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.manageButton}
          >
            <Text style={styles.manageButtonText}>Manage Family Members</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.familyAvatars}>
          <Image
            source={require("../../../assets/images/user.png")}
            style={styles.avatar}
          />
          <Image
            source={require("../../../assets/images/user.png")}
            style={styles.avatar}
          />
          <Image
            source={require("../../../assets/images/user.png")}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Manage Family Members</Text>
            {/* Aquí puedes agregar el contenido para gestionar miembros */}
            <Text>This is where you can add or remove family members.</Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      <View style={styles.sensorSection}>
  <View style={styles.sensorIconContainer}>
    <MaterialCommunityIcons
      name="motion-sensor"
      size={32}
      color="#985EE1"
    />
  </View>
  <View style={styles.sensorTextContainer}>
    <Text style={styles.sensorTitle}>Movimiento Detectado:</Text>
    <Text style={styles.sensorValue}>{sensores.mov}</Text>
  </View>
</View>


      {/* Weather Info */}
      <LinearGradient
        colors={["#985EE1", "#F25656"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.weatherCard}
      >
        <Text style={styles.locationText}>My Location</Text>
        <Text style={styles.cityText}>Chía, Cundinamarca</Text>
        <Text style={styles.temperature}>{sensores.temp}</Text>
        <Text style={styles.weatherDetails}>{getWeatherDetails(sensores.temp)}</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
  <TouchableOpacity
    style={[
      styles.tabButton,
      selectedTab === "Doors" && styles.activeTabButton,
    ]}
    onPress={() => setSelectedTab("Doors")}
  >
    <MaterialCommunityIcons
      name="door-closed" // ícono puerta cerrada
      size={20}
      color={selectedTab === "Doors" ? "#000" : "#888"}
      style={{ marginRight: 6 }}
    />
    <Text
      style={[
        styles.tabText,
        selectedTab === "Doors" ? styles.activeText : styles.inactiveText,
      ]}
    >
      Doors
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tabButton,
      selectedTab === "Other" && styles.activeTabButton,
    ]}
    onPress={() => setSelectedTab("Other")}
  >
    <MaterialCommunityIcons
      name="lightbulb" // ícono bombilla para luces
      size={20}
      color={selectedTab === "Other" ? "#000" : "#888"}
      style={{ marginRight: 6 }}
    />
    <Text
      style={[
        styles.tabText,
        selectedTab === "Other"
          ? styles.activeText
          : styles.inactiveText,
      ]}
    >
      Lights
    </Text>
  </TouchableOpacity>
</View>


      {/* Contenido Pestañas */}
      <View style={styles.cardsContainer}>
        {selectedTab === "Doors" ? (
          <>
            <DoorCard
              name="Cortina"
              isClosed={doors.cortina === "close"}
              image={require("@/assets/images/door.png")}
              onToggle={(newValue) => setDoorState("cortina", newValue ? "close" : "open")}
            />
            <DoorCard
              name="Garaje"
              isClosed={doors.garaje === "close"}
              image={require("@/assets/images/door.png")}
              onToggle={(newValue) => setDoorState("garaje", newValue ? "close" : "open")}
            />
            <DoorCard
              name="Principal"
              isClosed={doors.principal === "close"}
              image={require("@/assets/images/door.png")}
              onToggle={(newValue) => setDoorState("principal", newValue ? "close" : "open")}
            />
          </>
        ) : (
          <>
            <LightsCard
              name="Living Lights"
              devices={5}
              isOn={leds.cuarto === "on"}
              image={require("@/assets/images/living.png")}
              onToggle={(newValue) => setLedState("cuarto", newValue ? "on" : "off")}
            />
            <LightsCard
              name="Bed Lights"
              devices={3}
              isOn={leds.entrada === "on"}
              image={require("@/assets/images/living.png")}
              onToggle={(newValue) => setLedState("entrada", newValue ? "on" : "off")}
            />
            <LightsCard
              name="Kitchen"
              devices={2}
              isOn={leds.sala === "on"}
              image={require("@/assets/images/living.png")}
              onToggle={(newValue) => setLedState("sala", newValue ? "on" : "off")}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

function DoorCard({ name, isClosed, image, onToggle }) {
  return (
    <View style={styles.card}>
      {image && <Image source={image} style={styles.cardImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardSubtitle}>{isClosed ? "Closed" : "Open"}</Text>
        <CustomSwitch value={isClosed} onValueChange={onToggle} />
      </View>
    </View>
  );
}

function LightsCard({ name, devices, isOn, image, onToggle }) {
  return (
    <View style={styles.card}>
      {image && <Image source={image} style={styles.cardImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardSubtitle}>{isOn ? "On" : "Off"}</Text>  {/* Aquí el cambio */}
        <CustomSwitch value={isOn} onValueChange={onToggle} />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fa",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  familySection: {
    marginTop: 20,
  },
  subtitle: {
    color: "#777",
    fontSize: 16,
    marginBottom: 10,
  },
  familyAvatars: {
    flexDirection: "row",
    marginLeft: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginLeft: -20,
    borderWidth: 2,
    borderColor: colors.grey,

  },
  weatherCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  locationText: {
    color: "#fff",
    fontSize: 16,
  },
  cityText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  temperature: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  weatherDetails: {
    color: "#fff",
    marginTop: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e9ebf0",
    marginTop: 20,
    borderRadius: 10,
    padding: 4,
    marginBottom: 30,
    shadowColor: "#a3a3a3",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#fff",
    margin: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeText: {
    color: "#000",
  },
  inactiveText: {
    color: "#888",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#888",
    marginBottom: 10,
  },
  

  sensorSection: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#f0f0f3",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#a3a3a3",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  sensorIconContainer: {
    backgroundColor: "#e1e2e6",
    borderRadius: 25,
    padding: 15,
    marginRight: 20,
    shadowColor: "#d1d2d6",
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  sensorTextContainer: {
    flex: 1,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 5,
  },
  sensorValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#985EE1",
  },
  
  familyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  manageButton: {
    backgroundColor: colors.grey, // usa el color que prefieras
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  manageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.grey,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  
  
});
