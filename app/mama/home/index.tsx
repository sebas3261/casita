import CustomSwitch from "@/components/ToogleSwitch";
import colors from "@/styles/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../context/authContext/authContext"; // Asegúrate de que la ruta sea correcta
import { DoorsProvider, useDoorsContext } from "../../../context/doorsContext/DoorsContext";
import { LedProvider, useLedContext } from "../../../context/ledsContext/LedsContext";
import { useSensoresContext } from "../../../context/sensoresContext.tsx/SensoresContext";
import {
  useUsers,
} from "../../../context/usersContext/UsersContext";




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
  const { users, loading, error, updateUserRole, deleteUser } = useUsers();
  const { sensores } = useSensoresContext();
  const { userName } = useAuth();
  const capitalizedUserName =
  userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
  const [modalVisible, setModalVisible] = useState(false);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (Number(sensores.mov) === 0) {
      // Crear animación de shake en loop
      shakeAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 3, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -3, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ])
      );
      shakeAnimation.current.start();
    } else {
      // Detener animación si existe y resetear posición
      if (shakeAnimation.current) {
        shakeAnimation.current.stop();
        shakeAnimation.current = null;
      }
      shakeAnim.setValue(0);
    }
    
    // Limpieza al desmontar o cambiar sensores.mov
    return () => {
      if (shakeAnimation.current) {
        shakeAnimation.current.stop();
        shakeAnimation.current = null;
      }
      shakeAnim.setValue(0);
    };
  }, [sensores.mov]);

  const changeRole = async (uid: string, currentRole: string) => {
    // Ejemplo simple: alternar entre "Usuario" y "Admin"
    const newRole = currentRole === "Admin" ? "Usuario" : "Admin";

    try {
      setUpdatingUid(uid);
      await updateUserRole(uid, newRole);
      Alert.alert("Éxito", `Rol cambiado a ${newRole}`);
    } catch (err) {
      Alert.alert("Error", "No se pudo cambiar el rol");
    } finally {
      setUpdatingUid(null);
    }
  };

  const getWeatherDetails = (fotoCelda: "dia" | "noche" | "", hum?: number) => {
    if (fotoCelda === "dia") return `Día ☀️   H:${hum ?? "--"}°`;
    if (fotoCelda === "noche") return `Noche 🌙   H:${hum ?? "--"}°`;
    return `Desconocido   H:${hum ?? "--"}°`;
  };
  

  
  


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <Text style={styles.title}>
  Hola, {capitalizedUserName}
</Text>
        <Image
          // source={require("@/assets/settings.png")}
          style={styles.settingsIcon}
        />
      </View>

      


      <View style={styles.sensorSection}>
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX: shakeAnim }] }}>
      <View style={styles.sensorIconContainer}>
        <MaterialCommunityIcons
          name="motion-sensor"
          size={32}
          color="#985EE1"
        />
      </View>
      <View style={styles.sensorTextContainer}>
        <Text style={styles.sensorTitle}>Movimiento Detectado:</Text>
        <Text style={styles.sensorValue}>
          {Number(sensores.mov) === 0 ? "Detectando Movimiento" : "---"}
        </Text>
      </View>
    </Animated.View>
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
        <Text style={styles.weatherDetails}>{getWeatherDetails(sensores.fotoCelda, sensores.hum)}</Text>
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
              image={require("../../../assets/images/Cortina.jpeg")}
              onToggle={(newValue: any) => setDoorState("cortina", newValue ? "close" : "open")}
            />
            <DoorCard
              name="Puerta Principal"
              isClosed={doors.garaje === "close"}
              image={require("../../../assets/images/Principal.jpeg")}
              onToggle={(newValue: any) => setDoorState("garaje", newValue ? "close" : "open")}
            />
          </>
        ) : (
          <>
            <LightsCard
              name="Luz principal"
              devices={2}
              isOn={leds.sala === "on"}
              image={require("../../../assets/images/Sala.jpeg")}
              onToggle={(newValue: any) => setLedState("sala", newValue ? "on" : "off")}
            />
            <LightsCard
              name="Luces Cuarto "
              devices={3}
              isOn={leds.entrada === "on"}
              image={require("../../../assets/images/Cuarto.jpeg")}
              onToggle={(newValue: any) => setLedState("entrada", newValue ? "on" : "off")}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

interface DoorCardProps {
  name: string;
  isClosed: boolean;
  image: any; // Replace 'any' with a specific type if possible, e.g., ImageSourcePropType
  onToggle: (newValue: boolean) => void;
}

function DoorCard({ name, isClosed, image, onToggle }: DoorCardProps) {
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

interface LightsCardProps {
  name: string;
  devices: number;
  isOn: boolean;
  image: any; // Replace 'any' with a specific type if possible, e.g., ImageSourcePropType
  onToggle: (newValue: boolean) => void;
}

function LightsCard({ name, devices, isOn, image, onToggle }: LightsCardProps) {
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
    fontSize: 16,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: "#F3F3F5", // tono claro similar a la tarjeta
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 12,
  },
  loadingText: {
    color: "#999999",
    textAlign: "center",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  userCard: {
    backgroundColor: "#E9EBEE", // fondo un poco más oscuro para diferenciar
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444444",
  },
  userRole: {
    fontSize: 14,
    color: "#888888",
    marginTop: 2,
  },
  noUsersText: {
    textAlign: "center",
    color: "#999999",
    marginTop: 20,
    fontStyle: "italic",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: colors.black,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  
});
