"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import yaml from "js-yaml";
import { useState, useEffect } from "react";

interface ButtonSendProps {
  value: string; // 输入框中的值
  onClear: () => void; // 清空输入框和页面内容的回调
}

// Function to fetch config
async function fetchConfig() {
  try {
    const configRes = await fetch("/config.yaml");
    const configText = await configRes.text();
    const config = yaml.load(configText) as { backend_url: string; api_key: string };
    return config;
  } catch (error) {
    console.error("Error fetching config:", error);
    throw error;
  }
}

// Function to format input for API
async function formalizeInput(input: string, dialogueName: string, backendUrl: string, apiKey: string, systemMessage: string) {
  try {
    // Call the read-conversation API to fetch conversation history
    const historyResponse = await fetch(`${backendUrl}/read-conversation/${dialogueName}`, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    if (!historyResponse.ok) {
      throw new Error(`Failed to fetch conversation history: ${historyResponse.statusText}`);
    }

    const historyData = await historyResponse.json();
    console.log("Conversation History:", historyData.history);

    // Use the provided systemMessage parameter directly
    const messages = [{ role: "system", content: systemMessage }];

    // Extract all "user" and "assistant" messages in order
    const histories = historyData.history.filter((item: any) => typeof item === "object");
    histories.forEach((history: any) => {
      history.content.forEach((message: { role: string; content: string }) => {
        if (message.role === "user" || message.role === "assistant") {
          messages.push({ role: message.role, content: message.content });
        }
      });
    });

    // Add the current input as the last "user" message
    messages.push({ role: "user", content: input });

    console.log("Formatted Messages:", messages);

    return { messages };
  } catch (error) {
    console.error("Error formatting input:", error);
    throw error;
  }
}

// Function to handle chat API interaction
async function handleChatInteraction(
  input: string,
  dialogueName: string,
  config: { backend_url: string; api_key: string },
  systemMessage: string,
  onClear: () => void
) {
  try {
    const formattedInput = await formalizeInput(input, dialogueName, config.backend_url, config.api_key, systemMessage);

    const response = await fetch(`${config.backend_url}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.api_key,
      },
      body: JSON.stringify(formattedInput),
    });

    if (!response.ok) {
      throw new Error(`Chat API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message);
    onClear(); // 清空输入框和页面内容
  } catch (error) {
    console.error("Error sending chat message:", error);
  }
}

export function useIsResponding(
  modelLoading: boolean,
  modelGenerating: boolean,
  setResponding: (value: boolean) => void
) {
  useEffect(() => {
    if (modelLoading || modelGenerating) {
      setResponding(true);
    } else {
      setResponding(false);
    }
  }, [modelLoading, modelGenerating, setResponding]);
}

export default function Button_Send({ value, onClear }: ButtonSendProps) {
  const {
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
    dialogueName,
    systemMessageCoStar,
    setSystemMessageCoStar,
    gameStatus,
    setGameStatus,
    sendKeyPressed,
    setSendKeyPressed,
    responding,
    setResponding,
  } = useGlobalState();

  const [config, setConfig] = useState<{ backend_url: string; api_key: string } | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    };

    loadConfig();
  }, []);

  useIsResponding(modelLoading, modelGenerating, setResponding);

  const handleClick = async () => {
    if (!modelLoaded || responding || !config) return; // Prevent clicking when no model is loaded, responding is in progress, or config is not loaded

    await handleChatInteraction(value, dialogueName, config, systemMessageCoStar, onClear);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!modelLoaded || responding || !config}
      style={{
        position: "absolute",
        bottom: "5%",
        right: "1%",
        width: "8%", // 宽度为父容器的 5%
        height: "50px",
        backgroundColor: responding
          ? "#FFD700" // Yellow if responding
          : modelLoaded
          ? "#4CAF50" // Green if loaded
          : "#A9A9A9", // Gray otherwise
        color: "white",
        border: "none",
        borderRadius: "25px", // 半圆角
        fontSize: "14px",
        cursor: modelLoaded && !responding && config ? "pointer" : "not-allowed",
        textAlign: "center",
      }}
    >
      {responding
        ? "Responding"
        : modelLoaded
        ? "Send"
        : "No Model"}
    </button>
  );
}
