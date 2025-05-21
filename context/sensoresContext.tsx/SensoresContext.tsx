// context/SensoresContext.tsx
import { onValue, push, ref, set } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB as db } from "../../utils/firebaseConfig";
import { useAuth } from "../authContext/authContext";

interface SensoresState {
  mov: number;
  temp: number;
  hum: number;  // nueva variable humedad
}

interface SensoresContextProps {
  sensores: SensoresState;
}

const defaultSensoresState: SensoresState = {
  mov: 0,
  temp: 0,
  hum: 0,   // inicializar humedad en 0
};

const SensoresContext = createContext<SensoresContextProps>({
  sensores: defaultSensoresState,
});

export const SensoresProvider = ({ children }: { children: React.ReactNode }) => {
  const [sensores, setSensores] = useState<SensoresState>(defaultSensoresState);
  const { user, userName } = useAuth();

  const agregarRegistro = async (mensaje: string) => {
    try {
      const registrosRef = ref(db, "registros");
      const nuevoRegistroRef = push(registrosRef);
      const registro = {
        mensaje,
        usuario: userName || user?.email || "Anónimo",
        fecha: Date.now(),
      };
      await set(nuevoRegistroRef, registro);
      console.log("[Registro movimiento] Guardado:", registro);
    } catch (error) {
      console.error("[Registro movimiento] Error:", error);
    }
  };

  useEffect(() => {
    const sensoresRef = ref(db, "sensores");

    let ultimoMovimiento = 0;

    const unsubscribe = onValue(sensoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const nuevoEstado: SensoresState = {
          mov: data.mov ?? 0,
          temp: data.temp ?? 0,
          hum: data.hum ?? 0,   // leer humedad desde Firebase
        };

        if (nuevoEstado.mov === 1 && ultimoMovimiento !== 1) {
          agregarRegistro("Se detectó movimiento");
        }

        ultimoMovimiento = nuevoEstado.mov;
        setSensores(nuevoEstado);
      }
    });

    return () => unsubscribe();
  }, [user, userName]);

  return (
    <SensoresContext.Provider value={{ sensores }}>
      {children}
    </SensoresContext.Provider>
  );
};

export const useSensoresContext = () => useContext(SensoresContext);
