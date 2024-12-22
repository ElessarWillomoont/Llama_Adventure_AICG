"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for game status
interface PlayerStatus {
  type: string;
  name: string;
  state: string;
  money: number;
  health: number;
  stamina: number;
}

interface WorldStatus {
  type: string;
  state: string;
}

interface LocationStatus {
  type: string;
  state: string;
}

interface GameStatus {
  player: PlayerStatus;
  world: WorldStatus;
  shelter: LocationStatus;
}

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

  /**
   * Name of the dialogue
   * Default: "chating_history"
   */
  dialogueName: string;
  setDialogueName: (value: string) => void;

  /**
   * System message for co-star
   * Default: "You are a helpful assistant."
   */
  systemMessageCoStar: string;
  setSystemMessageCoStar: (value: string) => void;

  /**
   * Game status to store the state of the world and player
   */
  gameStatus: GameStatus;
  setGameStatus: (value: GameStatus) => void;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

// Provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isInDevMode, setIsInDevMode] = useState<boolean>(false); // Indicates whether the application is in development mode, default false
  const [isConnected, setIsConnected] = useState<boolean>(false); // Indicates whether the backend connection is successful, default false
  const [backendIsWorking, setBackendIsWorking] = useState<boolean>(false); // Indicates whether the backend is functioning properly, default false
  const [isConnectLose, setIsConnectLose] = useState<boolean>(false); // Indicates whether the connection has been lost, default false
  const [modelLoaded, setModelLoaded] = useState<boolean>(false); // Indicates whether a model is loaded, default false
  const [modelLoading, setModelLoading] = useState<boolean>(false); // Indicates whether a model is loading, default false
  const [modelGenerating, setModelGenerating] = useState<boolean>(false); // Indicates whether a model is generating, default false
  const [dialogueName, setDialogueName] = useState<string>("chating_history"); // Name of the dialogue, default "chating_history"
  const [systemMessageCoStar, setSystemMessageCoStar] = useState<string>("You are a helpful assistant."); // Default system message
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    player: {
      type: "玩家",
      name: "Default_Player",
      state: "一个玩家",
      money: 0,
      health: 100,
      stamina: 100,
    },
    world: {
      type: "世界描述",
      state: "一片世界大战导致的启示录危机后，一片荒无人烟的城市废墟",
    },
    shelter: {
      type: "地点",
      state: "玩家苏醒的地方",
    },
  });

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
        dialogueName,
        setDialogueName,
        systemMessageCoStar,
        setSystemMessageCoStar,
        gameStatus,
        setGameStatus,
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
