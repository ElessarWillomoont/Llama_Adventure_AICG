"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type of global state
interface GlobalStateType {
  /**
   * Indicates whether the application is in development mode
   * Default: false
   */
  isInDevMode: boolean;
  setIsInDevMode: (value: boolean) => void;

  /**
   * Indicates whether the backend connection is successful
   * Default: false
   */
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;

  /**
   * Indicates whether the backend is functioning properly
   * Default: false
   */
  backendIsWorking: boolean;
  setBackendIsWorking: (value: boolean) => void;

  /**
   * Indicates whether the connection has been lost
   * Default: false
   */
  isConnectLose: boolean;
  setIsConnectLose: (value: boolean) => void;

  /**
   * Indicates whether a model is loaded
   * Default: false
   */
  modelLoaded: boolean;
  setModelLoaded: (value: boolean) => void;

  /**
   * Indicates whether a model is loading
   * Default: false
   */
  modelLoading: boolean;
  setModelLoading: (value: boolean) => void;

  /**
   * Indicates whether a model is generating
   * Default: false
   */
  modelGenerating: boolean;
  setModelGenerating: (value: boolean) => void;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

// Provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isInDevMode, setIsInDevMode] = useState<boolean>(false); // Indicates whether the application is in development mode, default true
  const [isConnected, setIsConnected] = useState<boolean>(false); // Indicates whether the backend connection is successful, default false
  const [backendIsWorking, setBackendIsWorking] = useState<boolean>(false); // Indicates whether the backend is functioning properly, default false
  const [isConnectLose, setIsConnectLose] = useState<boolean>(false); // Indicates whether the connection has been lost, default false
  const [modelLoaded, setModelLoaded] = useState<boolean>(false); // Indicates whether a model is loaded, default false
  const [modelLoading, setModelLoading] = useState<boolean>(false); // Indicates whether a model is loading, default false
  const [modelGenerating, setModelGenerating] = useState<boolean>(false); // Indicates whether a model is generating, default false

  return (
    <GlobalStateContext.Provider
      value={{
        isInDevMode,
        setIsInDevMode,
        isConnected,
        setIsConnected,
        backendIsWorking,
        setBackendIsWorking,
        isConnectLose,
        setIsConnectLose,
        modelLoaded,
        setModelLoaded,
        modelLoading,
        setModelLoading,
        modelGenerating,
        setModelGenerating,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to access the context
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
