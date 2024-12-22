"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";

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
    setModelGenerating,
  } = useGlobalState();

  const handleClick = () => {
    if (!modelLoaded) return; // Prevent clicking when no model is loaded

    console.log("Input value:", value); // 记录输入框的内容到日志中
    onClear(); // 清空输入框和页面内容
  };

  return (
    <button
      onClick={handleClick}
      disabled={!modelLoaded}
      style={{
        position: "absolute",
        bottom: "5%",
        right: "1%",
        width: "8%", // 宽度为父容器的 5%
        height: "50px",
        backgroundColor: modelLoaded ? "#4CAF50" : "#A9A9A9", // Green if loaded, gray otherwise
        color: "white",
        border: "none",
        borderRadius: "25px", // 半圆角
        fontSize: "14px",
        cursor: modelLoaded ? "pointer" : "not-allowed",
        textAlign: "center",
      }}
    >
      {modelLoaded ? "Send" : "No Model"}
    </button>
  );
}
