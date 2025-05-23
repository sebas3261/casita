import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export default function CustomSwitch({ value, onValueChange }: CustomSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 24 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  return (
    <Pressable onPress={toggleSwitch} style={[styles.wrapper, value && styles.active]}>
      <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 30,
    backgroundColor: "#d4acfb",
    borderRadius: 50,
    padding: 3,
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#b84fce",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
});
