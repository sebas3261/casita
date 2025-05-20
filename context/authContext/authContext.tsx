import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { onValue, push, ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth, realtimeDB as db, storage } from "../../utils/firebaseConfig"; // Asegúrate que storage está exportado en firebaseConfig
import { dataReducer, defaultDataValues } from "../dataContext/dataReducer";
import { authReducer, defaultValues } from "./authReducer";

interface AuthContextProps {
  signup: (email: string, password: string, data: any, photoUri?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userState: {
    user?: User | null;
    isLogged: boolean;
  };
  user?: User | null;
  userName: string;
  userRole: string;
  getUserRole: () => string;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userState, dispatch] = useReducer(authReducer, defaultValues);
  const [dataState, dispatchData] = useReducer(dataReducer, defaultDataValues);
  const [loading, setLoading] = useState(true);

  // Función para subir imagen a Firebase Storage
  const uploadImage = async (uri: string, id: string): Promise<string> => {
    try {
      const storageReference = storageRef(storage, `carPhotos/${id}_${Date.now()}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageReference, blob);
      const url = await getDownloadURL(storageReference);
      console.log("URL de la imagen subida:", url);
      return url ?? "";
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return "";
    }
  };
  const uploadLocalPhotoIfExists = async (userId: string) => {
    try {
      const uri = await AsyncStorage.getItem('localPhotoUri');
      if (uri) {
        // sube la foto con tu función uploadImage (de tu contexto)
        const url = await uploadImage(uri, userId);
        // luego guarda en base de datos la URL de la foto
        await set(ref(db, "users/" + userId + "/photoURL"), url);
        // borra la URI local para que no se vuelva a subir
        await AsyncStorage.removeItem('localPhotoUri');
      }
    } catch (error) {
      console.error('Error subiendo foto local en login:', error);
    }
  };

  // Función para registrar eventos en Firebase
  const agregarRegistro = async (mensaje: string) => {
    const userName = dataState.name || userState.user?.email || "Anónimo";
    try {
      const registrosRef = ref(db, "registros");
      const nuevoRegistroRef = push(registrosRef);
      const registro = {
        mensaje,
        usuario: userName,
        fecha: Date.now(),
      };
      await set(nuevoRegistroRef, registro);
      console.log("[Registro de sesión] Registro guardado:", registro);
    } catch (error) {
      console.error("[Registro de sesión] Error guardando el registro:", error);
    }
  };

  // Cargar datos extra del usuario (nombre, rol, etc)
  const cargarDatosUsuario = (uid: string) => {
    return new Promise<void>((resolve) => {
      onValue(
        ref(db, `/users/${uid}`),
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            dispatchData({
              type: "LOGIN",
              payload: {
                name: data.username || "Anonymous",
                email: data.email || "Anonymous",
                role: data.role || "Usuario",
              },
            });
          } else {
            dispatchData({
              type: "LOGIN",
              payload: {
                name: "Anonymous",
                email: "Anonymous",
                role: "Usuario",
              },
            });
          }
          resolve();
        },
        {
          onlyOnce: true,
        }
      );
    });
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch({ type: "LOGIN", payload: firebaseUser });
        try {
          await cargarDatosUsuario(firebaseUser.uid);
        } catch (error) {
          console.error("Error cargando datos usuario:", error);
          dispatchData({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "LOGOUT" });
        dispatchData({ type: "LOGOUT" });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Registro de usuario con subida opcional de foto
  const signup = async (email: string, password: string, data: any, photoUri?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });

      // Subir foto si existe y obtener URL
      let photoURL = "";
      if (photoUri) {
        photoURL = await uploadImage(photoUri, user.uid);
      }

      // Guardar datos usuario en Realtime Database, incluyendo URL de foto si hay
      await set(ref(db, "users/" + user.uid), {
        username: data.name,
        email: email,
        role: data.role,
        photoURL,
      });

      dispatchData({ type: "LOGIN", payload: data });
    } catch (error) {
      console.error("Error en signup:", error);
      throw error;
    }
  };
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
  
      await cargarDatosUsuario(user.uid);
  
      // Subir foto local si existe
      await uploadLocalPhotoIfExists(user.uid);
  
      await agregarRegistro(`${dataState.name || user.email || "Usuario"} inició sesión`);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };
  

  // Logout con registro de evento
  const logout = async () => {
    try {
      const nombre = dataState.name || userState.user?.email || "Anónimo";
      await agregarRegistro(`${nombre} cerró sesión`);
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      dispatchData({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  };

  // Obtener rol actual
  const getUserRole = () => {
    return dataState.role || "";
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        userState,
        user: userState.user,
        userName: dataState.name || "",
        userRole: dataState.role || "",
        getUserRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
