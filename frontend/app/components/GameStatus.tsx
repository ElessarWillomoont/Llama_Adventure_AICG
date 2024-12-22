"use client";

import React from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";

const GameStatus: React.FC = () => {
  const {
    isInDevMode,
    isConnected,
    backendIsWorking,
    isConnectLose,
    modelLoaded,
    modelLoading,
    modelGenerating,
    dialogueName,
    systemMessageCoStar,
    gameStatus,
  } = useGlobalState();

  return (
    <div
      style={{
        position: "absolute", // 确保可以相对于父组件定位
        top: "3%",
        bottom: "15%",
        left: "1%",
        right: "71%",
        backgroundColor: "#f0f0f0", // 设置背景色
        border: "2px solid #ccc", // 边框样式
        borderRadius: "8px", // 圆角边框
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 添加阴影
        overflowY: "auto", // 启用垂直滚动条
        padding: "10px", // 添加内边距
        whiteSpace: "pre-wrap", // 自动换行
        wordWrap: "break-word", // 长单词折行
      }}
    >
      {isInDevMode ? (
        <pre style={{ fontWeight: "bold", color: "black" }}>
          {JSON.stringify(
            {
              isInDevMode,
              isConnected,
              backendIsWorking,
              isConnectLose,
              modelLoaded,
              modelLoading,
              modelGenerating,
              dialogueName,
              systemMessageCoStar,
              gameStatus,
            },
            null,
            2
          )}
        </pre>
      ) : (
        <div>
          <h3>Player Status</h3>
          <pre style={{ fontWeight: "bold", color: "black" }}>
            {JSON.stringify(gameStatus.player, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
