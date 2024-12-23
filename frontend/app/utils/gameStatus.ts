// utils/gameStatus.ts
import yaml from "js-yaml";

// Extracts special content embedded within <// ... //>
export const extractSpecialContent = (text: string): string => {
    const matches = text.match(/<\/\/.*?\/\//g);
    if (matches && matches.length > 0) {
      const trimmedChoice = matches[0].replace(/<\/\/Choice:\s*|\s*\/\//g, '').trim();
      console.log(`Extracted Choice: ${trimmedChoice}`);
      return trimmedChoice;
    } else {
      console.log("No valid choice found.");
      return ''; // Return empty string if no match found
    }
  };
  
  // Formats the context, objective, and style into a structured system message
  export const coStarToMessage = (
    context: string,
    objective: string,
    style: string,
    tone: string,
    audience: string,
    responseFormat: string
  ): string => {
    return `##Context##:\n ${context} \n ##Objective:##\n ${objective} \n ##Style:##\n ${style} \n ## Tone:##\n ${tone} \n ## Audience:##\n ${audience} \n ## Response Format:##\n ${responseFormat}`;
  };
  
  // Helper to safely parse YAML configuration
  export const loadConfig = async (): Promise<{ backend_url: string; api_key: string }> => {
    const response = await fetch("/config.yaml");
    const text = await response.text();
    return yaml.load(text) as { backend_url: string; api_key: string };
  };
  
  // Fetches the game status response from the backend
  export const fetchGameResponse = async (backendUrl: string, apiKey: string): Promise<string | null> => {
    const response = await fetch(`${backendUrl}/chat-get-response/`, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
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
      return lastAssistantResponse || null;
    }
  
    console.error("Error: " + data.response);
    return null;
  };
  