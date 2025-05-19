// context/DoorsContext.tsx
import { onValue, push, ref, set } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB as db } from "../../utils/firebaseConfig"; // Ajusta ruta
import { useAuth } from "../authContext/authContext"; // Ajusta ruta según tu proyecto

type DoorName = "cortina" | "garaje" | "principal";

interface DoorState {
  cortina: "close" | "open";
  garaje: "close" | "open";
  principal: "close" | "open";
}

interface DoorsContextProps {
  doors: DoorState;
  setDoorState: (doorName: DoorName, state: "close" | "open") => Promise<void>;
  refreshDoors: () => void;
}

const defaultDoorsState: DoorState = {
  cortina: "close",
  garaje: "close",
  principal: "close",
};

const DoorsContext = createContext<DoorsContextProps>({
  doors: defaultDoorsState,
  setDoorState: async () => {},
  refreshDoors: () => {},
});

export const DoorsProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado inicial es null, porque aún no se cargó desde la BD
  const [doors, setDoors] = useState<DoorState | null>(null);

  // Obtener usuario logueado
  const { user } = useAuth();

  // Escuchar cambios en /doors y actualizar estado local
  const listenDoors = () => {
    const doorsRef = ref(db, "doors");
    onValue(
      doorsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDoors({
            cortina: data.cortina === "open" ? "open" : "close",
            garaje: data.garaje === "open" ? "open" : "close",
            principal: data.principal === "open" ? "open" : "close",
          });
        } else {
          // Si no hay datos en BD, dejamos el estado como null o puedes definir un fallback
          setDoors(null);
        }
      },
      { onlyOnce: false }
    );
  };

  useEffect(() => {
    listenDoors();
  }, []);

  const agregarRegistro = async (mensaje: string) => {
    console.log("[agregarRegistro] usuario:", user);
    if (!user) {
      console.warn("[agregarRegistro] No hay usuario logueado, no se guardará registro.");
      return;
    }
  
    const registrosRef = ref(db, "registros");
    const nuevoRegistroRef = push(registrosRef);
  
    const registro = {
      mensaje,
      usuario: user.displayName || user.email || "Anónimo",
      fecha: Date.now(),
    };
  
    try {
      await set(nuevoRegistroRef, registro);
      console.log("[agregarRegistro] Registro guardado correctamente:", registro);
    } catch (error) {
      console.error("[agregarRegistro] Error guardando registro:", error);
    }
  };
  

  // Cambiar estado de una puerta y guardar registro
  const setDoorState = async (doorName: DoorName, state: "close" | "open") => {
    try {
      const doorRef = ref(db, `doors/${doorName}`);
      await set(doorRef, state);
      setDoors((prev) => ({ ...prev!, [doorName]: state }));

      // Crear mensaje legible
      const accion = state === "open" ? "abrir" : "cerrar";
      const mensaje = `${accion} ${doorName}`;
      await agregarRegistro(mensaje);
    } catch (error) {
      console.error("Error actualizando puerta:", error);
      throw error;
    }
  };

  // Refrescar manualmente (releer)
  const refreshDoors = () => {
    listenDoors();
  };

  return (
    <DoorsContext.Provider
      value={{
        // Si doors es null (no cargado aún), se da un fallback para evitar errores
        doors: doors || { cortina: "close", garaje: "close", principal: "close" },
        setDoorState,
        refreshDoors,
      }}
    >
      {children}
    </DoorsContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useDoorsContext = () => useContext(DoorsContext);
