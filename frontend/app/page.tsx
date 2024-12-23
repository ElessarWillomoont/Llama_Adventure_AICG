"use client";

import { useGlobalState } from "./contexts/GlobalStateContext";
import Button_DEV_MODE from "./components/Button_DEV_MODE";
import ButtonCheckCommunication from "./components/ButtonCheckCommunication";
import AnimatedCircle from "./components/AnimateCircle";
import ChatInterface from "./components/ChatInterface";
import DynamicBackground from "./components/DynamicBackground"

export default function Home() {
  const { isInDevMode, isConnected, backendIsWorking, isConnectLose } = useGlobalState();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Button_DEV_MODE />
      <ButtonCheckCommunication />
      <DynamicBackground />
      {isConnected && <AnimatedCircle />}
      {isConnected && !isConnectLose && <ChatInterface />}
    </div>
  );
}
