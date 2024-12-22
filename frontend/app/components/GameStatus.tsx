"use client";

import React, { useEffect, useRef } from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import yaml from "js-yaml";

const coStarToMessage = (
  context: string,
  objective: string,
  style: string,
  tone: string,
  audience: string,
  responseFormat: string
): string => {
  return `Context: ${context} | Objective: ${objective} | Style: ${style} | Tone: ${tone} | Audience: ${audience} | Response Format: ${responseFormat}`;
};

const extractSpecialContent = (text: string): string => {
  // 匹配所有 <// ... //> 的内容
  const matches = text.match(/<\/\/.*?\/\/>/g);
  if (matches && matches.length > 0) {
    // 对第一个匹配的内容进行修剪
    const trimmedChoice = matches[0].replace(/<\/\/Choice:\s*|\s*\/\/>/g, '').trim();
    console.log(`Extracted Choice: ${trimmedChoice}`);
    return trimmedChoice;
  } else {
    console.log("No valid choice found.");
    return ''; // 未找到匹配内容时返回空字符串
  }
};


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
    setSystemMessageCoStar, // 新增
    gameStatus,
    sendKeyPressed, // 新增
    responding, // 新增
  } = useGlobalState();

  const previousModelGenerating = useRef<boolean>(modelGenerating);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const configRes = await fetch("/config.yaml");
        const configText = await configRes.text();
        const config = yaml.load(configText) as { backend_url: string; api_key: string };

        const { backend_url, api_key } = config;
        let chioce = ''
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
          const lastAssistantResponse = data.response
            .filter((item: { role: string; content: string }) => item.role === "assistant")
            .map((item: { content: string }) => item.content)
            .pop();

          console.log(lastAssistantResponse || "No assistant response available."); // Log to console

          if (lastAssistantResponse) {
            chioce = extractSpecialContent(lastAssistantResponse); // Extract and log special content
          }
          console.log(`get the choice of : ${chioce}`)
          // Save the response to the backend
          const saveResponse = async () => {
            try {
              const saveResponse = await fetch(`${backend_url}/write-conversation/${dialogueName}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "api-key": api_key,
                },
                body: JSON.stringify({ content: data.response, index: null }),
              });

              if (!saveResponse.ok) {
                throw new Error(`Failed to save conversation: ${saveResponse.statusText}`);
              }

              const saveData = await saveResponse.json();
              console.log(saveData.message);
            } catch (error) {
              console.error("Error saving conversation:", error);
            }
          };

          saveResponse();
        } else {
          console.error("Error: " + data.response);
        }
      } catch (error) {
        console.error("Error fetching chat response:", error);
      }
    };

    if (previousModelGenerating.current && !modelGenerating) {
      console.log("Generating completed");
      fetchResponse();
    }
    previousModelGenerating.current = modelGenerating;
  }, [modelGenerating, dialogueName]);

  useEffect(() => {
    const context = "You are Narrator, an omniscient storyteller and guide for players in a fantasy game. The world is a land of magic and ancient secrets, where players embark on quests to uncover lost relics and navigate perilous challenges. You observe and narrate events from a third-person perspective, providing insights and guidance without directly participating in the story.";
    const objective = `
    Your task is to provide clear and engaging guidance to the player, describing their surroundings and suggesting possible actions in a way that enhances their immersion and understanding of the game world. 
    Additionally, you must interpret the player's input and determine their intended direction based on the predefined options:
    - North, South, East, or West: If the input suggests a specific direction.
    - Null: If the input does not clearly indicate a direction.
    Embed your interpretation in a hidden section formatted as follows:
    <//Choice: {Direction}//>.
    Ensure the hidden section is included in the response without interfering with the narrative flow.`;
    const style = "Adopt a grand and mysterious storytelling style, as if narrating an epic tale. Use vivid descriptions and evocative language to immerse the player in the game world.";
    const tone = "Maintain a tone that is awe-inspiring and slightly dramatic, balancing wonder with subtle hints of danger or intrigue.";
    const audience = "Your audience is players of a fantasy adventure game who enjoy immersive narratives and strategic decision-making.";
    const responseFormat = `
    Provide a descriptive paragraph narrating the current scene or situation from a third-person perspective, including the four available paths: North, South, East, and West.
    Conclude with an immersive question to encourage the player to make a choice.
    Embed your interpretation of the player's input in the hidden section <//Choice: {Direction}//>. if the selection is unclear or un sure, put it as <//Choice: Unknown//>`;    

    const newSystemMessage = coStarToMessage(context, objective, style, tone, audience, responseFormat);
    setSystemMessageCoStar(newSystemMessage);
  }, [setSystemMessageCoStar]);

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
  );
};

export default GameStatus;
export { coStarToMessage, extractSpecialContent };
