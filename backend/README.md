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

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/test-communication`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
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

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/init-db`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
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

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/new-conversation/test-dialogue`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
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

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/read-conversation/test-dialogue`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
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

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/write-conversation/test-dialogue`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Body (JSON):**
  ```json
  {
      "content": {"user": "Hello", "assistant": "Hi!"},
      "index": null
  }
  ```
- **Expected Response:**
  ```json
  {
      "message": "Content written to conversation."
  }
  ```

---

## **6. Load Model**

**Endpoint:**
```
POST /load_model/
```

**Description:**
Loads the specified model.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/load_model/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Body (JSON):**
  ```json
  {
      "pip_name": "microsoft/Phi-3.5-mini-instruct"
  }
  ```
- **Expected Response:**
  ```json
  {
      "message": "Model loading started in the background."
  }
  ```

---

## **7. Unload Model**

**Endpoint:**
```
POST /unload_model/
```

**Description:**
Unloads the currently loaded model.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/unload_model/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
  ```json
  {
      "message": "Model unloaded successfully."
  }
  ```

---

## **8. Chat**

**Endpoint:**
```
POST /chat/
```

**Description:**
Starts a chat process in the background with the provided messages.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:5000/chat/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Body (JSON):**
  ```json
  {
      "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "What is AI?"}
      ]
  }
  ```
- **Expected Response:**
  ```json
  {
      "message": "Chat generation started in the background."
  }
  ```

---

## **9. Chat Get Response**

**Endpoint:**
```
GET /chat-get-response/
```

**Description:**
Fetches the response from the last chat request once it is completed.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/chat-get-response/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Responses:**
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

## **10. Heartbeat**

**Endpoint:**
```
GET /heartbeat
```

**Description:**
Checks if the backend is running.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/heartbeat`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Response:**
  ```json
  {
      "status": "alive",
      "message": "Backend is running."
  }
  ```

---

## **11. Chat Generation Status**

**Endpoint:**
```
GET /chat-generation-status/
```

**Description:**
Checks if the chat generation task is currently running.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/chat-generation-status/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Responses:**
  - **Not Generating:**
    ```json
    {
        "chat_generating": false
    }
    ```
  - **Generating:**
    ```json
    {
        "chat_generating": true
    }
    ```

---

## **12. Load Model Status**

**Endpoint:**
```
GET /load-status/
```

**Description:**
Checks if a model loading task is currently running.

**Headers:**
- `api_key`: Your API key.

**Postman Test Example:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:5000/load-status/`
- **Headers:**
  ```
  api_key: my-secret-key
  ```
- **Expected Responses:**
  - **Not Loading:**
    ```json
    {
        "loading_model": false
    }
    ```
  - **Loading:**
    ```json
    {
        "loading_model": true
    }
    ```

---

