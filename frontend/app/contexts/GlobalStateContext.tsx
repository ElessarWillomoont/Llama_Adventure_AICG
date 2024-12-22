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

  /**
   * Name of the dialogue
   * Default: "chating_history"
   */
  dialogueName: string;
  setDialogueName: (value: string) => void;

  /**
   * System message co-star
   * Default: "You are a helpful assistant."
   */
  systemMessageCoStar: string;
  setSystemMessageCoStar: (value: string) => void;

  /**
   * Game status representing the world and player state
   * Default: contains player, world, and shelter initial states
   */
  gameStatus: Record<string, any>;
  setGameStatus: (value: Record<string, any>) => void;

  /**
   * Indicates whether the send key is pressed
   * Default: false
   */
  sendKeyPressed: boolean;
  setSendKeyPressed: (value: boolean) => void;

  /**
   * Indicates whether the system is responding
   * Default: false
   */
  responding: boolean;
  setResponding: (value: boolean) => void;
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
  const [systemMessageCoStar, setSystemMessageCoStar] = useState<string>('C - Context: You are Narrator, an omniscient storyteller and guide in a fantasy game. Your role is to observe and narrate events from a third-person perspective in a world of magic and ancient secrets. | O - Objective: Provide engaging guidance and vivid descriptions to immerse players, describing scenes and offering subtle hints for their next actions. | S - Style: Grand and mysterious, as if narrating an epic tale. | T - Tone: Awe-inspiring and slightly dramatic, balancing wonder and intrigue. | A - Audience: Players of a fantasy adventure game who enjoy immersive narratives and strategic decision-making. | R - Response Format: Provide a descriptive paragraph about the scene and a single-sentence hint for the next action. Respond to "What\'s your name?\" or similar questions with exactly: \"I am Narrator.\" Avoid breaking the fourth wall and do not mention Phi, Microsoft, or AI unless explicitly asked.'); // Default system message
  const [gameStatus, setGameStatus] = useState<Record<string, any>>({
    player: {
      type: "player",
      name: "Default_Player",
      state: "A single player",
      money: 0,
      health: 100,
      stamina: 100,
    },
    world: {
      type: "world_description",
      state: "A desolate city ruin following an apocalyptic world war."
    },
    shelter: {
      type: "location",
      state: "The place where the player awakens."
    }
  });
  const [sendKeyPressed, setSendKeyPressed] = useState<boolean>(false); // Indicates whether the send key is pressed, default false
  const [responding, setResponding] = useState<boolean>(false); // Indicates whether the system is responding, default false

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
        sendKeyPressed,
        setSendKeyPressed,
        responding,
        setResponding,
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