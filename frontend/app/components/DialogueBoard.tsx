"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import { useEffect, useRef, useState } from "react";
import yaml from "js-yaml";

export default function DialogueBoard() {
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

  const [responseText, setResponseText] = useState<string | null>(null);
  const previousModelGenerating = useRef<boolean>(modelGenerating);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const configRes = await fetch("/config.yaml");
        const configText = await configRes.text();
        const config = yaml.load(configText) as { backend_url: string; api_key: string };

        const { backend_url, api_key } = config;

        const response = await fetch(`${backend_url}/chat-get-response/`, {
          headers: {
            "Content-Type": "application/json",
            "api-key": api_key,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch response: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status === "completed") {
          const formattedResponse = data.response
            .map((item: { role: string; content: string }) => `${item.role}: ${item.content}`)
            .join("\n\n");
          setResponseText(formattedResponse);
        } else {
          setResponseText("Error: " + data.response);
        }
      } catch (error) {
        console.error("Error fetching chat response:", error);
        setResponseText("Error fetching response");
      }
    };

    if (previousModelGenerating.current && !modelGenerating) {
      console.log("Generating completed");
      fetchResponse();
    }
    previousModelGenerating.current = modelGenerating;
  }, [modelGenerating]);

  return (
    <div
      style={{
        position: "absolute",
        top: "3%",
        bottom: "15%",
        left: "10%",
        right: "10%",
        backgroundColor: "white", // White background
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden", // Hide scrollbars if content overflows
        padding: "10px", // Add some padding for better readability
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto", // Allow vertical scrolling if needed
          whiteSpace: "pre-wrap", // Preserve whitespace and wrap text
          color: "black", // Set font color to black
        }}
      >
        {responseText || "Waiting for response..."}
      </div>
    </div>
  );
}