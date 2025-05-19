// context/LedContext.tsx
import { onValue, push, ref, set } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB as db } from "../../utils/firebaseConfig"; // Ajusta ruta
import { useAuth } from "../authContext/authContext"; // Asegúrate de tener este hook correctamente configurado

type LedName = "cuarto" | "entrada" | "sala";

interface LedState {
  cuarto: "on" | "off";
  entrada: "on" | "off";
  sala: "on" | "off";
}

interface LedContextProps {
  leds: LedState;
  setLedState: (ledName: LedName, state: "on" | "off") => Promise<void>;
  refreshLeds: () => void;
}

const defaultLedsState: LedState = {
  cuarto: "off",
  entrada: "off",
  sala: "off",
};

const LedContext = createContext<LedContextProps>({
  leds: defaultLedsState,
  setLedState: async () => {},
  refreshLeds: () => {},
});

export const LedProvider = ({ children }: { children: React.ReactNode }) => {
  const [leds, setLeds] = useState<LedState>(defaultLedsState);
  const { user } = useAuth();

  // Escuchar cambios en los LEDs
  const listenLeds = () => {
    const ledsRef = ref(db, "leds");
    onValue(
      ledsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLeds({
            cuarto: data.cuarto === "on" ? "on" : "off",
            entrada: data.entrada === "on" ? "on" : "off",
            sala: data.sala === "on" ? "on" : "off",
          });
        } else {
          setLeds(defaultLedsState);
        }
      },
      { onlyOnce: false }
    );
  };

  useEffect(() => {
    listenLeds();
  }, []);

  // Función para agregar un registro en Firebase
  const agregarRegistro = async (mensaje: string) => {
    if (!user) {
      console.warn("[agregarRegistro] No hay usuario logueado.");
      return;
    }

    const registro = {
      mensaje,
      usuario: user.displayName || user.email || "Anónimo",
      fecha: Date.now(),
    };

    try {
      const registrosRef = ref(db, "registros");
      const nuevoRegistroRef = push(registrosRef);
      await set(nuevoRegistroRef, registro);
      console.log("[agregarRegistro] Registro guardado:", registro);
    } catch (error) {
      console.error("[agregarRegistro] Error al guardar el registro:", error);
    }
  };

  // Cambiar estado del LED y guardar registro
  const setLedState = async (ledName: LedName, state: "on" | "off") => {
    try {
      const ledRef = ref(db, `leds/${ledName}`);
      await set(ledRef, state);
      setLeds((prev) => ({ ...prev, [ledName]: state }));

      const accion = state === "on" ? "encendió" : "apagó";
      const mensaje = `Se ${accion} el LED de ${ledName}`;
      await agregarRegistro(mensaje);
    } catch (error) {
      console.error("Error actualizando LED:", error);
      throw error;
    }
  };

  const refreshLeds = () => {
    listenLeds();
  };

  return (
    <LedContext.Provider value={{ leds, setLedState, refreshLeds }}>
      {children}
    </LedContext.Provider>
  );
};

export const useLedContext = () => useContext(LedContext);
