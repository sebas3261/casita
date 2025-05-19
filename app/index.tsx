import { Redirect } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/Colors";
export default function Welcome() {
  const [step, setStep] = useState(0);
  const [redirect, setRedirect] = useState(false);

  const handleNext = () => {
    if (step === 2) {
      setRedirect(true);
    } else {
      setStep(step + 1);
    }
  };

  if (redirect) {
    return <Redirect href="./auth" />; // Cambia la ruta a tu pantalla principal
  }

  // Textos para cada paso, puedes agregar imágenes en assets si quieres
  const stepContents = [
    {
      title: "Controla tu hogar desde cualquier lugar",
      subtitle: "Gestiona luces, temperatura y seguridad con un toque.",
      // image: require("../assets/smart_home_1.png"),
    },
    {
      title: "Automatizaciones inteligentes",
      subtitle: "Programa escenarios para que tu casa se adapte a ti.",
      // image: require("../assets/smart_home_2.png"),
    },
    {
      title: "Monitorea en tiempo real",
      subtitle: "Recibe alertas y datos precisos para mantener tu hogar seguro.",
      // image: require("../assets/smart_home_3.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Si tienes imágenes descomenta esta línea y cambia la ruta */}
        {/* <Image source={stepContents[step].image} style={styles.image} /> */}
      </View>

      <View style={styles.pagination}>
        {stepContents.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.activeDot]}
          />
        ))}
      </View>

      <Text style={styles.title}>{stepContents[step].title}</Text>
      <Text style={styles.subtitle}>{stepContents[step].subtitle}</Text>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{step === stepContents.length - 1 ? "Comenzar" : "Siguiente"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 25,
    paddingTop: 60,
    justifyContent: "flex-start",
  },
  imageContainer: {
    height: 220,
    width: "100%",
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f0f0f0", // Solo para debug, quitar si quieres
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  pagination: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DDD",
    marginRight: 12,
  },
  activeDot: {
    backgroundColor: colors.black, // Usa tu color principal
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "400",
    color: colors.grayDark,
    marginBottom: 60,
  },
  button: {
    backgroundColor: colors.black,
    paddingVertical: 15,
    borderRadius: 14,
    width: "85%",
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
