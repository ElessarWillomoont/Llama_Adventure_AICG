import yaml from "js-yaml";

// Function to fetch config
export async function fetchConfig() {
  try {
    const configRes = await fetch("/config.yaml");
    const configText = await configRes.text();
    const config = yaml.load(configText) as { backend_url: string; api_key: string };
    return config;
  } catch (error) {
    console.error("Error fetching config:", error);
    throw error;
  }
}

// Function to format input for API
export async function formalizeInput(
  input: string,
  dialogueName: string,
  backendUrl: string,
  apiKey: string,
  systemMessage: string
) {
  try {
    // Call the read-conversation API to fetch conversation history
    const historyResponse = await fetch(`${backendUrl}/read-conversation/${dialogueName}`, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    if (!historyResponse.ok) {
      throw new Error(`Failed to fetch conversation history: ${historyResponse.statusText}`);
    }

    const historyData = await historyResponse.json();
    console.log("Conversation History:", historyData.history);

    const messages = [{ role: "system", content: systemMessage }];
    const histories = historyData.history.filter((item: any) => typeof item === "object");
    histories.forEach((history: any) => {
      history.content.forEach((message: { role: string; content: string }) => {
        if (message.role === "user" || message.role === "assistant") {
          messages.push({ role: message.role, content: message.content });
        }
      });
    });

    messages.push({ role: "user", content: input });

    console.log("Formatted Messages:", messages);
    return { messages };
  } catch (error) {
    console.error("Error formatting input:", error);
    throw error;
  }
}

// Function to call chat API
export async function callChatAPI(
  formattedInput: { messages: any[] },
  backendUrl: string,
  apiKey: string
) {
  try {
    const response = await fetch(`${backendUrl}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(formattedInput),
    });

    if (!response.ok) {
      throw new Error(`Chat API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message);
    return data;
  } catch (error) {
    console.error("Error calling chat API:", error);
    throw error;
  }
}

// Function to handle chat interaction
export async function handleChatInteraction(
  input: string,
  dialogueName: string,
  config: { backend_url: string; api_key: string },
  systemMessage: string
) {
  try {
    const formattedInput = await formalizeInput(input, dialogueName, config.backend_url, config.api_key, systemMessage);
    const data = await callChatAPI(formattedInput, config.backend_url, config.api_key);
    return data;
  } catch (error) {
    console.error("Error in chat interaction:", error);
    throw error;
  }
}
