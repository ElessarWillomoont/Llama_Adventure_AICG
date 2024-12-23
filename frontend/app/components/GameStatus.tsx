"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import { extractSpecialContent, coStarToMessage, loadConfig, fetchGameResponse } from "../utils/gameStatus";
import { coStar_Status1, coStar_Status2_West, coStar_Status2_South, coStar_Status2_North, coStar_Status2_East } from "../utils/coStar";

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
    setDialogueName,
    systemMessageCoStar,
    setSystemMessageCoStar, 
    gameStatus,
    setGameStatus,
    sendKeyPressed, 
    responding, 
  } = useGlobalState();

  const previousModelGenerating = useRef<boolean>(modelGenerating);
  const [gameStep, setGameStep] = useState("GameStatus.1"); 
  const [choiceOfGame, setChoiceOfGame] = useState(''); 

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const config = await loadConfig();

        const { backend_url, api_key } = config;

        const lastAssistantResponse = await fetchGameResponse(backend_url, api_key);

        if (lastAssistantResponse) {
          const choice = extractSpecialContent(lastAssistantResponse); // Extract and log special content
          console.log(`Extracted Choice: ${choice}`);
          setChoiceOfGame(choice);
        }
      } catch (error) {
        console.error("Error fetching chat response:", error);
      }
    };

    if (previousModelGenerating.current && !modelGenerating) {
      console.log("Generating completed in GameStatus");
      fetchResponse();
    }
    previousModelGenerating.current = modelGenerating;
  }, [modelGenerating, dialogueName]);
// for game status 1
  useEffect(() => {
    if (gameStep === "GameStatus.1") {
      switch (choiceOfGame) {
        case 'North':
          setGameStep("GameStatus.2.north");
          console.log('enter N');
          break;
        case 'South':
          console.log('enter S');
          setGameStep("GameStatus.2.south");
          break;
        case 'East':
          setGameStep("GameStatus.2.east");
          console.log('enter E');
          break;
        case 'West':
          console.log('enter W');
          setGameStep("GameStatus.2.west");
          break;
        default:
          console.log('No valid choice');
      }
    }
  }, [gameStep, choiceOfGame]);

  useEffect(() => {
    if (gameStep === "GameStatus.1") {
      setDialogueName("chat_temp_1");

      const newSystemMessage = coStarToMessage(
        coStar_Status1.context,
        coStar_Status1.objective,
        coStar_Status1.style,
        coStar_Status1.tone,
        coStar_Status1.audience,
        coStar_Status1.responseFormat
      );

      setSystemMessageCoStar(newSystemMessage);
    }
  }, [gameStep, setSystemMessageCoStar]);

// for game status 2


// for the west
useEffect(() => {
  if (gameStep === "GameStatus.2.west") {
    switch (choiceOfGame) {
      case 'Dead':
        console.log('Player Dead');

        setGameStatus((prevStatus: Record<string, any>) => ({
          ...prevStatus,
          player: {
            ...prevStatus.player,
            health: 0,
          },
        }));
        break;
      
      default:
        console.log('No valid choice');
    }
  }
}, [gameStep, choiceOfGame]);

useEffect(() => {
  if (gameStep === "GameStatus.2.west") {
    setDialogueName("chat_temp_2");

    const newSystemMessage = coStarToMessage(
      coStar_Status2_West.context,
      coStar_Status2_West.objective,
      coStar_Status2_West.style,
      coStar_Status2_West.tone,
      coStar_Status2_West.audience,
      coStar_Status2_West.responseFormat
    );

    setSystemMessageCoStar(newSystemMessage);
  }
}, [gameStep, setSystemMessageCoStar]);

// for the south

useEffect(() => {
  if (gameStep === "GameStatus.2.south") {
    switch (choiceOfGame) {
      case 'Dead':
        console.log('Player Dead');

        setGameStatus((prevStatus: Record<string, any>) => ({
          ...prevStatus,
          player: {
            ...prevStatus.player,
            health: 0,
          },
        }));
        break;
      
      default:
        console.log('No valid choice');
    }
  }
}, [gameStep, choiceOfGame]);

useEffect(() => {
  if (gameStep === "GameStatus.2.south") {
    setDialogueName("chat_temp_2");

    const newSystemMessage = coStarToMessage(
      coStar_Status2_South.context,
      coStar_Status2_South.objective,
      coStar_Status2_South.style,
      coStar_Status2_South.tone,
      coStar_Status2_South.audience,
      coStar_Status2_South.responseFormat
    );

    setSystemMessageCoStar(newSystemMessage);
  }
}, [gameStep, setSystemMessageCoStar]);


// for the north

useEffect(() => {
  if (gameStep === "GameStatus.2.north") {
    switch (choiceOfGame) {
      case 'Dead':
        console.log('Player Dead');

        setGameStatus((prevStatus: Record<string, any>) => ({
          ...prevStatus,
          player: {
            ...prevStatus.player,
            health: 0,
          },
        }));
        break;
      
      default:
        console.log('No valid choice');
    }
  }
}, [gameStep, choiceOfGame]);

useEffect(() => {
  if (gameStep === "GameStatus.2.north") {
    setDialogueName("chat_temp_2");

    const newSystemMessage = coStarToMessage(
      coStar_Status2_North.context,
      coStar_Status2_North.objective,
      coStar_Status2_North.style,
      coStar_Status2_North.tone,
      coStar_Status2_North.audience,
      coStar_Status2_North.responseFormat
    );

    setSystemMessageCoStar(newSystemMessage);
  }
}, [gameStep, setSystemMessageCoStar]);


// for the east

useEffect(() => {
  if (gameStep === "GameStatus.2.east") {
    switch (choiceOfGame) {
      case 'Left':
        console.log('enter L');
        break;
      case 'Right':
        console.log('enter R');
        break;
      default:
        console.log('No valid choice');
    }
  }
}, [gameStep, choiceOfGame]);

useEffect(() => {
  if (gameStep === "GameStatus.2.east") {
    setDialogueName("chat_temp_2");

    const newSystemMessage = coStarToMessage(
      coStar_Status2_East.context,
      coStar_Status2_East.objective,
      coStar_Status2_East.style,
      coStar_Status2_East.tone,
      coStar_Status2_East.audience,
      coStar_Status2_East.responseFormat
    );

    setSystemMessageCoStar(newSystemMessage);
  }
}, [gameStep, setSystemMessageCoStar]);

  return (
    <div>
      <div
        style={{
          position: "absolute", 
          top: "1%", 
          left: "1%",
          backgroundColor: isInDevMode ? "#e0ffe0" : "inherit", 
          fontWeight: "bold",
          color: "green", 
          padding: "5px"
        }}
      >
        {isInDevMode && <span>Current Game Step: {gameStep}</span>}
      </div>
      <div
        style={{
          position: "absolute", 
          top: "3%",
          bottom: "15%",
          left: "1%",
          right: "71%",
          backgroundColor: "#f0f0f0", 
          border: "2px solid #ccc", 
          borderRadius: "8px", 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
          overflowY: "auto", 
          padding: "10px", 
          whiteSpace: "pre-wrap", 
          wordWrap: "break-word", 
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
                sendKeyPressed, // 添加到 JSON 显示中
                responding, // 添加到 JSON 显示中
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
    </div>
  );
};

export default GameStatus;