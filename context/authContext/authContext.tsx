import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { onValue, push, ref, set } from "firebase/database";
import React, { createContext, useContext, useEffect, useReducer } from "react";

import { auth, realtimeDB as db } from "../../utils/firebaseConfig";
import { dataReducer, defaultDataValues } from "../dataContext/dataReducer";
import { authReducer, defaultValues } from "./authReducer";

interface AuthContextProps {
  signup: (email: string, password: string, data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userState: {
    user?: User | null;
    isLogged: boolean;
  };
  user?: User | null;
  userName: string;
  userRole: string;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userState, dispatch] = useReducer(authReducer, defaultValues);
  const [dataState, dispatchData] = useReducer(dataReducer, defaultDataValues);

  // 👉 Función para registrar eventos en Firebase
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

  // 👀 Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch({ type: "LOGIN", payload: firebaseUser });

        onValue(
          ref(db, "/users/" + firebaseUser.uid),
          (snapshot) => {
            const username = snapshot.val()?.username || "Anonymous";
            const emailDb = snapshot.val()?.email || "Anonymous";
            const roleDb = snapshot.val()?.role || "Usuario";
            dispatchData({
              type: "LOGIN",
              payload: { name: username, email: emailDb, role: roleDb },
            });
          },
          { onlyOnce: true }
        );
      } else {
        dispatch({ type: "LOGOUT" });
        dispatchData({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Registro de usuario
  const signup = async (email: string, password: string, data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      dispatchData({ type: "LOGIN", payload: data });

      await set(ref(db, "users/" + user.uid), {
        username: data.name,
        email: email,
        role: data.role,
      });
    } catch (error) {
      console.error("Error en signup:", error);
      throw error;
    }
  };

  // ✅ Login con registro de evento
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });

      onValue(
        ref(db, "/users/" + user.uid),
        async (snapshot) => {
          const username = snapshot.val()?.username || "Anonymous";
          const emailDb = snapshot.val()?.email || "Anonymous";
          const roleDb = snapshot.val()?.role || "Usuario";
          dispatchData({
            type: "LOGIN",
            payload: { name: username, email: emailDb, role: roleDb },
          });

          // ✅ Guardar registro de inicio de sesión
          await agregarRegistro(`${username} inició sesión`);
        },
        { onlyOnce: true }
      );
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // ✅ Logout con registro de evento
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
