"use client";

import { useState } from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import InputBox from "../components/InputBox";

export default function ChatInterface() {
  const { isConnected, isConnectLose } = useGlobalState();
  const [inputValue, setInputValue] = useState<string>("");

  // Render the component only if the connection is successful and not lost
  if (!isConnected || isConnectLose) {
    return null;
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
        backgroundColor: "rgba(128, 128, 128, 0.5)", // Gray color with 50% transparency
        borderRadius: "8px",
        zIndex: 1000, // Ensure the component stays on top
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          fontSize: "18px",
          color: "#000", // Text color
        }}
      >
        {inputValue || "Type something in the input box..."}
      </div>
      <InputBox value={inputValue} onChange={setInputValue} />
    </div>
  );
}
