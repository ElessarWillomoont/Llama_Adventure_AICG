# API User Guide

This document provides a detailed guide for using the APIs in the provided backend application. Each API endpoint is explained with its purpose, input requirements, expected responses, and examples.

(In case I forget how to use them xp)

---

## **1. Test Communication**

**Endpoint:**
```
GET /test-communication
```

**Description:**
Tests communication with the backend.

**Headers:**
- `api_key`: Your API key.

**Request Example:**
```bash
curl -X GET http://127.0.0.1:5000/test-communication \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Hallo World!"
}
```

---

## **2. Initialize Database**

**Endpoint:**
```
POST /init-db
```

**Description:**
Initializes the database directory.

**Headers:**
- `api_key`: Your API key.

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/init-db \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Database directory initialized.",
    "path": "/path/to/db"
}
```

---

## **3. Create New Conversation**

**Endpoint:**
```
POST /new-conversation/{dialogue_name}
```

**Description:**
Creates a new conversation file with the specified `dialogue_name`.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/new-conversation/test-dialogue \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "New conversation created.",
    "file_path": "/path/to/test-dialogue.yaml"
}
```

---

## **4. Read Conversation History**

**Endpoint:**
```
GET /read-conversation/{dialogue_name}
```

**Description:**
Retrieves the history of the specified conversation.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Query Parameters:**
- `index` (optional): Index of the history to retrieve.

**Request Example:**
```bash
curl -X GET http://127.0.0.1:5000/read-conversation/test-dialogue \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Conversation history retrieved.",
    "history": ["# Conversation history initialized"]
}
```

---

## **5. Write to Conversation**

**Endpoint:**
```
POST /write-conversation/{dialogue_name}
```

**Description:**
Adds content to the specified conversation.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Request Body:**
```json
{
    "content": {"user": "Hello", "assistant": "Hi!"},
    "index": null
}
```

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/write-conversation/test-dialogue \
     -H "api_key: <your-api-key>" \
     -d '{"content": {"user": "Hello", "assistant": "Hi!"}, "index": null}'
```

**Response Example:**
```json
{
    "message": "Content written to conversation."
}
```

---

## **6. Process Dialogue**

**Endpoint:**
```
POST /process-dialogue/{dialogue_name}
```

**Description:**
Processes the dialogue history with the loaded model.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/process-dialogue/test-dialogue \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Dialogue processed with model."
}
```

---

## **7. Generate Response**

**Endpoint:**
```
POST /generate-response/{dialogue_name}
```

**Description:**
Generates a model response for the specified input text.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Request Body:**
```json
{
    "input_text": "What is AI?"
}
```

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/generate-response/test-dialogue \
     -H "api_key: <your-api-key>" \
     -d '{"input_text": "What is AI?"}'
```

**Response Example:**
```json
{
    "message": "Response generated and added to conversation."
}
```

---

## **8. Summarize Conversation**

**Endpoint:**
```
GET /summarize-conversation/{dialogue_name}
```

**Description:**
Summarizes the entire conversation history.

**Headers:**
- `api_key`: Your API key.

**Path Parameters:**
- `dialogue_name`: The name of the conversation.

**Request Example:**
```bash
curl -X GET http://127.0.0.1:5000/summarize-conversation/test-dialogue \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Conversation summarized.",
    "summary": "Summary of the conversation."
}
```

---

## **9. Load Model**

**Endpoint:**
```
POST /load_model/
```

**Description:**
Loads the specified model.

**Headers:**
- `api_key`: Your API key.

**Request Body:**
```json
{
    "pip_name": "microsoft/Phi-3.5-mini-instruct"
}
```

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/load_model/ \
     -H "api_key: <your-api-key>" \
     -d '{"pip_name": "microsoft/Phi-3.5-mini-instruct"}'
```

**Response Example:**
```json
{
    "message": "Model 'microsoft/Phi-3.5-mini-instruct' loaded successfully."
}
```

---

## **10. Unload Model**

**Endpoint:**
```
POST /unload_model/
```

**Description:**
Unloads the currently loaded model.

**Headers:**
- `api_key`: Your API key.

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/unload_model/ \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "message": "Model unloaded successfully."
}
```

---

## **11. Chat**

**Endpoint:**
```
POST /chat/
```

**Description:**
Starts a chat process in the background with the provided messages.

**Headers:**
- `api_key`: Your API key.

**Request Body:**
```json
{
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is AI?"}
    ]
}
```

**Request Example:**
```bash
curl -X POST http://127.0.0.1:5000/chat/ \
     -H "api_key: <your-api-key>" \
     -d '{"messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "What is AI?"}]}'
```

**Response Example:**
```json
{
    "message": "Chat generation started in the background."
}
```

---

## **12. Chat Status**

**Endpoint:**
```
GET /chat-status/
```

**Description:**
Checks the status of the last chat request.

**Headers:**
- `api_key`: Your API key.

**Request Example:**
```bash
curl -X GET http://127.0.0.1:5000/chat-status/ \
     -H "api_key: <your-api-key>"
```

**Response Examples:**
- **Processing:**
  ```json
  {
      "status": "processing",
      "response": null
  }
  ```
- **Completed:**
  ```json
  {
      "status": "completed",
      "response": "Artificial Intelligence refers to..."
  }
  ```
- **Error:**
  ```json
  {
      "status": "error",
      "response": "Error message here"
  }
  ```

---

## **13. Heartbeat**

**Endpoint:**
```
GET /heartbeat
```

**Description:**
Checks if the backend is running.

**Headers:**
- `api_key`: Your API key.

**Request Example:**
```bash
curl -X GET http://127.0.0.1:5000/heartbeat \
     -H "api_key: <your-api-key>"
```

**Response Example:**
```json
{
    "status": "alive",
    "message": "Backend is running."
}
```

---