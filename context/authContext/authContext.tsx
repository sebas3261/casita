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
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, realtimeDB as db, storage } from "../../utils/firebaseConfig";

interface AuthContextProps {
  signup: (email: string, password: string, data: any, photoUri?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user?: User | null;
  userName: string;
  userRole: string;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Subir imagen a Firebase Storage
  const uploadImage = async (uri: string, id: string): Promise<string> => {
    try {
      const storageReference = storageRef(storage, `carPhotos/${id}_${Date.now()}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageReference, blob);
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
      const uri = await AsyncStorage.getItem("localPhotoUri");
      if (uri) {
        const url = await uploadImage(uri, userId);
        await set(ref(db, "users/" + userId + "/photoURL"), url);
        await AsyncStorage.removeItem("localPhotoUri");
      }
    } catch (error) {
      console.error("Error subiendo foto local en login:", error);
    }
  };

  // Registro de eventos en Firebase
  const agregarRegistro = async (mensaje: string) => {
    const nombre = userName || user?.email || "Anónimo";
    try {
      const registrosRef = ref(db, "registros");
      const nuevoRegistroRef = push(registrosRef);
      const registro = {
        mensaje,
        usuario: nombre,
        fecha: Date.now(),
      };
      await set(nuevoRegistroRef, registro);
      console.log("[Registro de sesión] Registro guardado:", registro);
    } catch (error) {
      console.error("[Registro de sesión] Error guardando el registro:", error);
    }
  };

  // Cargar datos extra del usuario (nombre, rol, etc)
  const cargarDatosUsuario = (uid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      onValue(
        ref(db, `/users/${uid}`),
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserName(data.username || "Anonymous");
            setUserRole(data.role || "Usuario");
          } else {
            setUserName("Anonymous");
            setUserRole("Usuario");
          }
          resolve();
        },
        { onlyOnce: true }
      );
    });
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await cargarDatosUsuario(firebaseUser.uid);
        } catch (error) {
          console.error("Error cargando datos usuario:", error);
          setUserName("");
          setUserRole("");
        }
      } else {
        setUser(null);
        setUserName("");
        setUserRole("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Registrar nuevo usuario
  const signup = async (email: string, password: string, data: any, photoUri?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      let photoURL = "";
      if (photoUri) {
        photoURL = await uploadImage(photoUri, firebaseUser.uid);
      }

      await set(ref(db, "users/" + firebaseUser.uid), {
        username: data.name,
        email,
        role: data.role,
        photoURL,
      });

      setUserName(data.name);
      setUserRole(data.role);
    } catch (error) {
      console.error("Error en signup:", error);
      throw error;
    }
  };

  // Login usuario existente
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      await cargarDatosUsuario(firebaseUser.uid);
      await uploadLocalPhotoIfExists(firebaseUser.uid);
      await agregarRegistro(`${userName || firebaseUser.email || "Usuario"} inició sesión`);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const nombre = userName || user?.email || "Anónimo";
      await agregarRegistro(`${nombre} cerró sesión`);
      await signOut(auth);
      setUser(null);
      setUserName("");
      setUserRole("");
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        userName,
        userRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
