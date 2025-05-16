import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { createContext, useReducer } from "react";
import { dataReducer } from "../dataContext/dataReducer";
import { authReducer, AuthState } from "./authReducer";

const defaultValues: AuthState = {
  user: undefined,
  isLogged: false,
};

const defaultDataValues = {
  name: undefined,
};

interface AuthContextProps {
  signup: (email: string, password: string, data: any) => void;
  login: (email: string, password: string) => Promise<void>;
  userState: AuthState;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [userState, dispatch] = useReducer(authReducer, defaultValues);
  const [dataState, dispatchData] = useReducer(dataReducer, defaultDataValues);
  const auth = getAuth();
  const db = getDatabase();

  const signup = async (email: string, password: string, data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      dispatchData({ type: "LOGIN", payload: data });
      set(ref(db, "users/" + user.uid), {
        username: data.name,
        email: email,
      });
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      const value = onValue(
        ref(db, "/users/" + user.uid),
        (snapshot) => {
          const username =
            (snapshot.val() && snapshot.val().username) || "Anonymous";
          const email = (snapshot.val() && snapshot.val().email) || "Anonymous";
          dispatchData({
            type: "LOGIN",
            payload: { name: username, email: email },
          });
        },
        {
          onlyOnce: true,
        }
      );
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        userState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
