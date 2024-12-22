"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import yaml from "js-yaml";

interface ButtonSendProps {
  value: string; // 输入框中的值
  onClear: () => void; // 清空输入框和页面内容的回调
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
  } = useGlobalState();

  const handleClick = async () => {
    if (!modelLoaded || modelGenerating || modelLoading) return; // Prevent clicking when no model is loaded, generating is in progress, or loading is in progress

    try {
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      const response = await fetch(`${backend_url}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: value },
          ],
        }),
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
  };

  return (
    <button
      onClick={handleClick}
      disabled={!modelLoaded || modelGenerating || modelLoading}
      style={{
        position: "absolute",
        bottom: "5%",
        right: "1%",
        width: "8%", // 宽度为父容器的 5%
        height: "50px",
        backgroundColor: modelLoading
          ? "#FFA500" // Orange if loading
          : modelGenerating
          ? "#FFD700" // Yellow if generating
          : modelLoaded
          ? "#4CAF50" // Green if loaded
          : "#A9A9A9", // Gray otherwise
        color: "white",
        border: "none",
        borderRadius: "25px", // 半圆角
        fontSize: "14px",
        cursor: modelLoaded && !modelGenerating && !modelLoading ? "pointer" : "not-allowed",
        textAlign: "center",
      }}
    >
      {modelLoading
        ? "Model Loading"
        : modelGenerating
        ? "Generating"
        : modelLoaded
        ? "Send"
        : "No Model"}
    </button>
  );
}
