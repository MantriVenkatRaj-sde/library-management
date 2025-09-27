// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { getUserDetails } from "../API/userAPI";  // <-- you already made this

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!isAuthenticated || !user) {
        if (mounted) setUserDetails(null);
        return;
      }

      setLoadingUser(true);
      try {
        const response = await getUserDetails(user); // <-- use your API
        if (mounted) setUserDetails(response.data);   // store in context
      } catch (error) {
        console.error("Failed to load user details:", error);
        if (mounted) setUserDetails(null);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
