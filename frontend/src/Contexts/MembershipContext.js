// src/Contexts/MembershipContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUserMembershipApi } from "../API/membershipAPI";
import { useAuth } from "../Authentication/AuthContext";

const MembershipContext = createContext();

export function MembershipProvider({ children }) {
  const { user } = useAuth(); // store { username } in your AuthContext
  const username = user?.username || user; // tolerate string or object
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const fetchMemberships = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await getUserMembershipApi(username); // must be a string
      setMemberships(resp.data || []);
    } catch (e) {
      setError(e);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // hydrate whenever username changes (e.g., after login)
  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  return (
    <MembershipContext.Provider
      value={{
        memberships,
        setMemberships, // expose if you want optimistic updates
        loading,
        error,
        refresh: fetchMemberships, // call after mutations (create/join/leave)
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  return useContext(MembershipContext);
}
