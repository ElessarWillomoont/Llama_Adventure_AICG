"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import yaml from "js-yaml";

export default function UnstallModule() {
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
    setModelGenerating,
  } = useGlobalState();

  const handleClick = async () => {
    if (!modelLoaded) return; // Prevent clicking when no model is loaded

    try {
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      const response = await fetch(`${backend_url}/unload_model/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to unload model: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);
      setModelLoaded(false);
    } catch (error) {
      console.error("Error unloading model:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!modelLoaded}
      style={{
        position: "absolute",
        top: "1%",
        right: "1%",
        width: "50px",
        height: "50px",
        backgroundColor: modelLoaded ? "#FF4500" : "#A9A9A9", // OrangeRed if loaded, gray otherwise
        color: "white",
        border: "none",
        borderRadius: "50%", // Full circle
        fontSize: "14px",
        cursor: modelLoaded ? "pointer" : "not-allowed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      U
    </button>
  );
}
