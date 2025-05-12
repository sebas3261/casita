import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface TabButtonHoverProps {
  focused: boolean;
  children: React.ReactNode;
}

export default function TabButtonHover({ focused, children }: TabButtonHoverProps) {
  const scale = useRef(new Animated.Value(1)).current; // Inicializamos la escala en 1
  const backgroundOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current; // Inicializamos la opacidad

  useEffect(() => {
    // Reiniciamos la animación cada vez que el valor de `focused` cambia
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1, // Cambiar tamaño al 120% si está enfocado
        useNativeDriver: true,
        friction: 2,  // Menos fricción para un rebote más pronunciado
        tension: 80, // Ajuste de la tensión para un rebote más suave
      }),

      Animated.timing(backgroundOpacity, {
        toValue: focused ? 1 : 0, // Opacidad total cuando está enfocado, o a 0 cuando no lo está
        duration: 300, // Duración más corta para una transición rápida
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]); // Se ejecuta cada vez que `focused` cambia

  return (
    <Animated.View
      style={{
        width: 48,  // Tamaño del círculo
        height: 48,
        borderRadius: 24,  // Radio para el círculo
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale }], // Aplicamos la animación de escala
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: 48, // Tamaño igual al de la bolita
          height: 48,
          borderRadius: 24,
          backgroundColor: 'black',
          opacity: backgroundOpacity, // Aplicamos la animación de opacidad
        }}
      />
      {children}
    </Animated.View>
  );
}
