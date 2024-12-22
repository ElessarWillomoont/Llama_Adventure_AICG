"use client";

import { useEffect, useState } from "react";
import yaml from "js-yaml";
import { useGlobalState } from "../contexts/GlobalStateContext";

export default function AnimatedCircle() {
  const {
    isConnected,
    setIsConnected,
    isConnectLose,
    setIsConnectLose,
    isInDevMode,
    modelLoaded,
    setModelLoaded,
    modelLoading,
    setModelLoading,
    modelGenerating,
    setModelGenerating,
  } = useGlobalState();

  const [isError, setIsError] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  let intervalId: NodeJS.Timeout | null = null;

  const log = (message: string) => {
    if (isInDevMode) {
      console.log(message);
    }
  };

  const checkHeartbeat = async () => {
    try {
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      // Check heartbeat
      const heartbeatResponse = await fetch(`${backend_url}/heartbeat`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!heartbeatResponse.ok) {
        throw new Error(`Heartbeat API call failed: ${heartbeatResponse.statusText}`);
      }

      const heartbeatData = await heartbeatResponse.json();

      if (heartbeatData.status === "alive") {
        log("Backend is running.");
        setIsConnected(true);
        setIsConnectLose(false);
        setIsError(false);
      } else {
        throw new Error("Backend status is not alive.");
      }

      // Check model loading status
      const loadStatusResponse = await fetch(`${backend_url}/load-status/`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!loadStatusResponse.ok) {
        throw new Error(`Load Status API call failed: ${loadStatusResponse.statusText}`);
      }

      const loadStatusData = await loadStatusResponse.json();
      setModelLoading(loadStatusData.loading_model);

      // Check chat generation status
      const chatGenStatusResponse = await fetch(`${backend_url}/chat-generation-status/`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!chatGenStatusResponse.ok) {
        throw new Error(`Chat Generation Status API call failed: ${chatGenStatusResponse.statusText}`);
      }

      const chatGenStatusData = await chatGenStatusResponse.json();
      setModelGenerating(chatGenStatusData.chat_generating);

      // Check if a model is loaded
      const hasModelResponse = await fetch(`${backend_url}/has_model/`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!hasModelResponse.ok) {
        throw new Error(`Has Model API call failed: ${hasModelResponse.statusText}`);
      }

      const hasModelData = await hasModelResponse.json();
      setModelLoaded(hasModelData.has_model);
    } catch (err) {
      if (err instanceof Error) {
        log(`Error: ${err.message}`);
      } else {
        log("An unknown error occurred.");
      }
      setIsConnected(false);
      setIsConnectLose(true);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      intervalId = setInterval(() => {
        checkHeartbeat();
      }, 100); // Check every 100ms (10 times per second)
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    }; // Clean up on component unmount or pause
  }, [isPaused]);

  const handlePauseToggle = () => {
    if (isInDevMode) {
      setIsPaused((prev) => !prev);
    }
  };

  if (!isConnected && !isError) return null; // Render nothing if not connected and no error

  return (
    <div
      onClick={handlePauseToggle}
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        borderWidth: "5px",
        borderStyle: "solid",
        borderColor: isPaused ? "#FFD700" : isError ? "#E11D48" : "#4F46E5", // Yellow when paused, red on error, blue otherwise
        borderTopWidth: "5px",
        borderTopStyle: "solid",
        borderTopColor: isPaused ? "transparent" : isError ? "#F87171" : "transparent", // Separate borderTop property
        animation: isPaused ? "none" : isError ? "none" : "rotate 2s linear infinite, pulse 1.5s ease-in-out infinite",
        zIndex: 1000, // Ensure it stays on top of other elements
        cursor: isInDevMode ? "pointer" : "default",
      }}
    >
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
