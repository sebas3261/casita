import {
    onValue, ref,
    remove
} from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB as db } from "../../utils/firebaseConfig"; // Ajusta ruta


interface Registro {
  id: string;
  mensaje: string;
  usuario: string;
  fecha: number;
}

interface RegistrosContextProps {
  registros: Registro[];
  deleteRegistro: (id: string) => Promise<void>;
  deleteAllRegistros: () => Promise<void>;
}

export const RegistrosContext = createContext<RegistrosContextProps>({} as RegistrosContextProps);
export const useRegistros = () => useContext(RegistrosContext);

export const RegistrosProvider = ({ children }: { children: React.ReactNode }) => {
  const [registros, setRegistros] = useState<Registro[]>([]);

  // Cargar registros desde Firebase
  useEffect(() => {
    const registrosRef = ref(db, "registros");
    const unsubscribe = onValue(registrosRef, (snapshot) => {
      const data = snapshot.val();
      const registrosList: Registro[] = [];
      if (data) {
        for (let id in data) {
          registrosList.push({ id, ...data[id] });
        }
      }
      setRegistros(registrosList);
    });

    return () => unsubscribe();
  }, []);

  // Eliminar un registro individual
  const deleteRegistro = async (id: string) => {
    try {
      const registroRef = ref(db, `registros/${id}`);
      await remove(registroRef);
    } catch (error) {
      console.error("Error al borrar el registro:", error);
      throw error;
    }
  };

  // Eliminar todos los registros
  const deleteAllRegistros = async () => {
    try {
      const registrosRef = ref(db, "registros");
      await remove(registrosRef); // Esto borra toda la colección de registros
    } catch (error) {
      console.error("Error al borrar todos los registros:", error);
      throw error;
    }
  };

  return (
    <RegistrosContext.Provider value={{ registros, deleteRegistro, deleteAllRegistros }}>
      {children}
    </RegistrosContext.Provider>
  );
};
