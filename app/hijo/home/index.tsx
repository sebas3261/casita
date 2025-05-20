import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useAuth } from "../../../context/authContext/authContext";
import { DoorsProvider, useDoorsContext } from "../../../context/doorsContext/DoorsContext";
import { LedProvider, useLedContext } from "../../../context/ledsContext/LedsContext";
import { useSensoresContext } from "../../../context/sensoresContext.tsx/SensoresContext";

export default function HomeWrapper() {
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

  const { doors, setDoorState } = useDoorsContext();
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
    return "🌤️ Partly Cloudy   H:17°  L:5°";
  };

  useEffect(() => {
    if (sensores.mov === 1) {
      Alert.alert(
        "⚠️ Security Alert",
        "Movement detected!",
        [{ text: "OK" }]
      );
    }
  }, [sensores.mov]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {capitalizedUserName}</Text>
      </View>

      {/* Sensor Movimiento */}
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
    </ScrollView>
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
});
