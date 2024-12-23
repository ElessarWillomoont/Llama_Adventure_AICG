"use client";

import React from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import defaultImage from "../../public/background/default_background.webp";

const DynamicBackground = () => {
  const { gameScene } = useGlobalState();

  // Determine background image based on gameScene
  const getBackgroundImage = () => {
    switch (gameScene) {
      case "forest":
        return defaultImage;
      default:
        return defaultImage;
    }
  };

  const backgroundStyle: React.CSSProperties = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    transition: "background 0.5s ease",
    background: `url(${getBackgroundImage()}) no-repeat center center`,
    backgroundSize: "cover", // Ensure the image scales to cover the container
  };

  return <div style={backgroundStyle} />;
};

export default DynamicBackground;
