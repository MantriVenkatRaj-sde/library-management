import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const GenresContext = createContext(null);

// Provider component - wrap your App with this in index.jsx or App.jsx
export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([]); // null = not loaded yet

  return (
    <GenresContext.Provider value={{ genres, setGenres }}>
      {children}
    </GenresContext.Provider>
  );
}

// Hook for consuming
export function useGenres() {
  const ctx = useContext(GenresContext);
  if (!ctx) throw new Error("useGenres must be used inside GenresProvider");
  return ctx; // { genres, setGenres }
}
