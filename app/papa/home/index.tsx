import CustomSwitch from "@/components/ToogleSwitch";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../context/authContext/authContext"; // Asegúrate de que la ruta sea correcta
import { DoorsProvider, useDoorsContext } from "../../../context/doorsContext/DoorsContext";
import { LedProvider, useLedContext } from "../../../context/ledsContext/LedsContext";
import { useSensoresContext } from "../../../context/sensoresContext.tsx/SensoresContext";




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
        <Text style={styles.subtitle}>Family Members</Text>
        <View style={styles.familyAvatars}>
          {/* Puedes agregar imágenes aquí si quieres */}
        </View>
      </View>

      <View style={styles.sensorSection}>
        <Text style={styles.sensorTitle}>Movimiento Detectado:</Text>
        <Text style={styles.sensorValue}>{sensores.mov}</Text>
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
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
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sensorValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#985EE1",
  },
  
});
