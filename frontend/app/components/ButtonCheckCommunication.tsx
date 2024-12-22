"use client";

import { useState } from "react";
import yaml from "js-yaml";
import { useGlobalState } from "../contexts/GlobalStateContext";

export default function ButtonCheckCommunication() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { isConnected, setIsConnected, isConnectLose, setIsConnectLose, isInDevMode } = useGlobalState();

  const log = (message: string) => {
    if (isInDevMode) {
      console.log(message);
    }
  };

  const callApi = async () => {
    try {
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      const response = await fetch(`${backend_url}/test-communication`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      log("Communication successful: Initialization complete");
      setApiResponse(data.message);
      setIsConnected(true);
      setIsConnectLose(false); // Communication succeeded, connection is not lost
      log("isConnected state: true");
      setIsVisible(false); // Hide the button and response
      setError(null);
    } catch (err: any) {
      setApiResponse(null);
      setError(err.message || "Something went wrong");
      setIsConnected(false);
      setIsConnectLose(true); // Communication failed, connection is lost
      log("isConnected state: false");
      log("isConnectLose state: true");
    }
  };

  if (!isVisible) return null; // Don't render anything if not visible

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        onClick={callApi}
        style={{
          backgroundColor: "#1D4ED8",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Call Backend API
      </button>
      {apiResponse && (
        <p style={{ marginTop: "10px", color: "green" }}>Response: {apiResponse}</p>
      )}
      {error && <p style={{ marginTop: "10px", color: "red" }}>Error: {error}</p>}
    </div>
  );
}
