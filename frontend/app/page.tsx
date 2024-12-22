"use client";

import Button_DEV_MODE from "./components/Button_DEV_MODE";
import ButtonCheckCommunication from "./components/ButtonCheckCommunication";
import AnimatedCircle from "./components/AnimateCircle"


export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Button_DEV_MODE />
      <AnimatedCircle />
      <ButtonCheckCommunication />
    </div>
  );
}
