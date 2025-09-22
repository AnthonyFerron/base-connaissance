"use client";

import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({ generation: null, types: [] });
  const [search, setSearch] = useState("");

  return (
    <FiltersContext.Provider value={{ filters, setFilters, search, setSearch }}>
      {children}
    </FiltersContext.Provider>
  );
}

// Hook pratique pour utiliser le contexte
export function useFilters() {
  return useContext(FiltersContext);
}
