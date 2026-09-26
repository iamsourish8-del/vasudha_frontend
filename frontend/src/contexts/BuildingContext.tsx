/**
 * BuildingContext — single source of truth for the currently active building.
 * Every module reads from here instead of maintaining its own selector.
 */

import React, { createContext, useContext, useState, useCallback } from "react";

interface BuildingContextValue {
  activeBuilding: string | null;
  setActiveBuilding: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

const BuildingContext = createContext<BuildingContextValue | undefined>(undefined);

export const BuildingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBuilding, setActiveBuildingState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setActiveBuilding = useCallback((id: string) => {
    setActiveBuildingState(id);
    localStorage.setItem("lastBuildingId", id);
  }, []);

  return (
    <BuildingContext.Provider
      value={{ activeBuilding, setActiveBuilding, isLoading, setIsLoading }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export function useBuilding(): BuildingContextValue {
  const ctx = useContext(BuildingContext);
  if (!ctx) throw new Error("useBuilding must be used inside BuildingProvider");
  return ctx;
}