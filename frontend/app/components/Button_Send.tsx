"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import { useState, useEffect } from "react";
import { fetchConfig, handleChatInteraction } from "../utils/chatAPIInteraction";

interface ButtonSendProps {
  value: string; // 输入框中的值
  onClear: () => void; // 清空输入框和页面内容的回调
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
    modelLoaded,
    modelLoading,
    modelGenerating,
    dialogueName,
    systemMessageCoStar,
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

  useEffect(() => {
    if (sendKeyPressed) {
      (async () => {
        if (modelLoaded && config) {
          try {
            await handleChatInteraction(value, dialogueName, config, systemMessageCoStar);
            onClear(); // 清空输入框和页面内容
          } catch (error) {
            console.error("Error handling sendKeyPressed interaction:", error);
          } finally {
            setSendKeyPressed(false); // Reset sendKeyPressed
          }
        }
      })();
    }
  }, [sendKeyPressed, modelLoaded, config, value, dialogueName, systemMessageCoStar, onClear, setSendKeyPressed]);

  const handleMouseDown = () => {
    setSendKeyPressed(true);
  };

  const handleMouseUp = () => {
    setSendKeyPressed(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={!modelLoaded || responding || !config}
      style={{
        position: "absolute",
        bottom: "5%",
        right: "1%",
        width: "8%",
        height: "50px",
        backgroundColor: responding
          ? "#FFD700"
          : modelLoaded
          ? "#4CAF50"
          : "#A9A9A9",
        color: "white",
        border: "none",
        borderRadius: "25px",
        fontSize: "14px",
        cursor: modelLoaded && !responding && config ? "pointer" : "not-allowed",
        textAlign: "center",
      }}
    >
      {responding ? "Responding" : modelLoaded ? "Send" : "No Model"}
    </button>
  );
}
