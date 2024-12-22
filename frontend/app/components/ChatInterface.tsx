"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";

export default function ChatInterface() {
  // Accessing global state variables
  const {
    isInDevMode,
    isConnected,
    backendIsWorking,
    isConnectLose,
  } = useGlobalState();

  // Only render the component if connected and no connection loss
  if (!isConnected || isConnectLose) {
    return null; // Do not render anything
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%",
        height: "90%",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Chat Interface</h2>
        <p style={{ marginTop: "10px" }}>
          {isConnected ? "Connected to Backend" : "Not Connected"}
        </p>
        <p style={{ color: backendIsWorking ? "green" : "red" }}>
          {backendIsWorking ? "Backend is Working" : "Backend Not Working"}
        </p>
        {isInDevMode && (
          <p style={{ marginTop: "10px", color: "blue" }}>
            Development Mode is On
          </p>
        )}
      </div>
    </div>
  );
}
