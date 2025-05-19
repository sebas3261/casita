import CustomSwitch from "@/components/ToogleSwitch";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";




export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Lights");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Image
          // source={require("@/assets/settings.png")}
          style={styles.settingsIcon}
        />
      </View>

      {/* Family Members */}
      <View style={styles.familySection}>
        <Text style={styles.subtitle}>Family Members</Text>
        <View style={styles.familyAvatars}>
          <Image source={require("@/assets/images/user.png")} style={styles.avatar} />
          <Image source={require("@/assets/images/user.png")} style={styles.avatar} />
          <Image source={require("@/assets/images/user.png")} style={styles.avatar} />
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
        <Text style={styles.cityText}>Montreal</Text>
        <Text style={styles.temperature}>-10°</Text>
        <Text style={styles.weatherDetails}>🌤️ Partly Cloudy   H:2°  L:12°</Text>
      </LinearGradient>

      {/* Tabs as Radio Buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Lights" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("Lights")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Lights" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Lights
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Devices" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("Devices")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Devices"
                ? styles.activeText
                : styles.inactiveText,
            ]}
          >
            Devices
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lights Cards */}
      <View style={styles.LightsContainer}>
        {selectedTab === "Lights" ? (
          <>
            <LightsCard
              name="Living Lights"
              devices={5}
              isOn={true}
              image={require("@/assets/images/living.png")}
            />
            <LightsCard
              name="BedLights"
              devices={3}
              isOn={false}
              image={require("@/assets/images/living.png")}
            />
          </>
        ) : (
          <>
            <LightsCard
              name="Kitchen"
              devices={2}
              isOn={true}
              // image={require("@/assets/images/kitchen.png")}
            />
            <LightsCard
              name="BathLights"
              devices={1}
              isOn={false}
              // image={require("@/assets/images/bathLights.png")}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

function LightsCard({ name, devices, isOn, image }) {
  const [value, setValue] = useState(isOn);

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardSubtitle}>{devices} devices</Text>
        <CustomSwitch value={value} onValueChange={setValue} />
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
  LightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // Aproximadamente la mitad del ancho con espacio entre
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 100, // Más pequeño
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
});
