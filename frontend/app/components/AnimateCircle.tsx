"use client";

import { useEffect, useState } from "react";
import yaml from "js-yaml";
import { useGlobalState } from "../contexts/GlobalStateContext";

export default function AnimatedCircle() {
  const { isConnected, setIsConnected, isConnectLose, setIsConnectLose, isInDevMode } = useGlobalState();
  const [isError, setIsError] = useState<boolean>(false);

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

      const response = await fetch(`${backend_url}/heartbeat`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "alive") {
        log("Backend is running.");
        setIsConnected(true);
        setIsConnectLose(false); // Communication succeeded
        setIsError(false);
      } else {
        throw new Error("Backend status is not alive.");
      }
    } catch (err) {
      if (err instanceof Error) {
        log(`Error: ${err.message}`);
      } else {
        log("An unknown error occurred.");
      }
      setIsConnected(false);
      setIsConnectLose(true); // Communication failed
      setIsError(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkHeartbeat();
    }, 1000); // Check every 1 second

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  if (!isConnected && !isError) return null; // Render nothing if not connected and no error

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: `5px solid ${isError ? "#E11D48" : "#4F46E5"}`, // Red on error, blue otherwise
        borderTop: `5px solid ${isError ? "#F87171" : "transparent"}`, // Add contrast for rotation
        animation: isError ? "none" : "rotate 2s linear infinite, pulse 1.5s ease-in-out infinite",
        zIndex: 1000, // Ensure it stays on top of other elements
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
