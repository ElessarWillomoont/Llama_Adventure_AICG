"use client";

import { useGlobalState } from "../contexts/GlobalStateContext";
import yaml from "js-yaml";

export default function Button_LoadModel() {
  const {
    modelLoaded,
    setModelLoaded,
    modelLoading,
    setModelLoading,
  } = useGlobalState();

  const handleClick = async () => {
    if (modelLoading || modelLoaded) return; // Prevent multiple clicks

    setModelLoading(true);

    try {
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      const response = await fetch(`${backend_url}/load_model/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
        },
        body: JSON.stringify({
          pip_name: "microsoft/Phi-3.5-mini-instruct",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);
      setModelLoaded(true);
    } catch (error) {
      console.error("Error loading model:", error);
    } finally {
      setModelLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={modelLoading || modelLoaded}
      style={{
        position: "absolute",
        bottom: "5%",
        left: "1%",
        width: "8%",
        height: "50px",
        backgroundColor: modelLoaded ? "#32CD32" : "#1E90FF", // Green if loaded, blue otherwise
        color: "white",
        border: "none",
        borderRadius: "25px",
        fontSize: "14px",
        cursor: modelLoading || modelLoaded ? "not-allowed" : "pointer",
        textAlign: "center",
      }}
    >
      {modelLoading ? "Model Loading" : modelLoaded ? "Model Loaded" : "Load Model"}
    </button>
  );
}
