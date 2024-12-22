"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";

export default function Button_DEV_MODE() {
  const { isInDevMode, setIsInDevMode } = useGlobalState();

  const toggleDevMode = () => {
    setIsInDevMode(!isInDevMode);
  };

  return (
    <button
      onClick={toggleDevMode}
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        padding: "8px 16px",
        backgroundColor: isInDevMode ? "red" : "green",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        zIndex: 1000, // 确保按钮在最顶层
      }}
    >
      {isInDevMode ? "Close Dev Mode" : "Start Dev Mode"}
    </button>
  );
}
