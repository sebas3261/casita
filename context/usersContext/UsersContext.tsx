import { onValue, ref, update } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { realtimeDB as db } from "../../utils/firebaseConfig";

interface UserData {
  uid: string;
  username: string;
  email: string;
  role: string;
}

interface UsersContextProps {
  users: UserData[];
  loading: boolean;
  error: string | null;
  updateUserRole: (uid: string, newRole: string) => Promise<void>;
    //deleteUser
  refreshUsers: () => void;
  deleteUser: (uid: string) => Promise<void>;

}

const UsersContext = createContext<UsersContextProps>({
  users: [],
  loading: false,
  error: null,
  updateUserRole: async () => {},
  refreshUsers: () => {},
      deleteUser: async () => {},


});

export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersList: UserData[] = Object.entries(data).map(
            ([uid, userObj]: [string, any]) => ({
              uid,
              username: userObj.username || "Sin Nombre",
              email: userObj.email || "Sin Email",
              role: userObj.role || "Usuario",
            })
          );
          setUsers(usersList);
        } else {
          setUsers([]);
        }
        setError(null);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchUsers();
    return () => unsubscribe();
  }, []);

  const updateUserRole = async (uid: string, newRole: string) => {
    try {
      await update(ref(db, `users/${uid}`), { role: newRole });
      // Actualización inmediata gracias a onValue
    } catch (err) {
      setError("Error actualizando rol: " + (err as Error).message);
      throw err;
    }
  };
 

  //deleteUser
    const deleteUser = async (uid: string) => {
        try {
        await update(ref(db, `users/${uid}`), { deleted: true });
        // Actualización inmediata gracias a onValue
        } catch (err) {
        setError("Error eliminando usuario: " + (err as Error).message);
        throw err;
        }
    };
  

  const refreshUsers = () => {
    fetchUsers();
  };

  return (
    <UsersContext.Provider
      value={{ users, loading, error, updateUserRole, refreshUsers, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  );
};
