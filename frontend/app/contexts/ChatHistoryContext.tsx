"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for chat history
interface ChatMessage {
  role: string;
  content: string;
}

interface ChatHistoryContextType {
  chatHistory: ChatMessage[];
  setChatHistory: (newHistory: ChatMessage[]) => void;
  addMessageToHistory: (message: ChatMessage) => void;
}

// Create the context
const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

// Provider component
export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Function to add a single message to the history
  const addMessageToHistory = (message: ChatMessage) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  return (
    <ChatHistoryContext.Provider value={{ chatHistory, setChatHistory, addMessageToHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

// Custom hook to access the chat history context
export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
};
