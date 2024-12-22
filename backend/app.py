from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yaml
from models.util import init_db_dir, new_conversation, read_conversation, write_conversation
from models.model_new import load_model, unload_model
from pydantic import BaseModel

# Load configuration from config.yaml
with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)
API_KEY = config.get("API_KEY", "default_key")
FRONTEND_URL = config.get("FRONTEND_URL", "http://localhost:3000")
MAX_NEW_TOKENS = config.get("max_new_tokens", 4096)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Allow requests from your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Global variables for the model pipeline and device
model_pipeline = None
max_new_tokens = MAX_NEW_TOKENS
loading_status = {"loading_model": False, "chat_generating": False}

def validate_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="API key not correct")

@app.get("/test-communication")
def test_communication(api_key: str = Header(...)):
    validate_api_key(api_key)
    return {"message": "Hallo World!"}

@app.post("/init-db")
def initialize_database(api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        db_path = init_db_dir()
        return {"message": "Database directory initialized.", "path": db_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/new-conversation/{dialogue_name}")
def create_new_conversation(dialogue_name: str, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        file_path = new_conversation(dialogue_name)
        return {"message": "New conversation created.", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/read-conversation/{dialogue_name}")
def get_conversation(dialogue_name: str, index: int = None, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        history = read_conversation(dialogue_name, index)
        return {"message": "Conversation history retrieved.", "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/write-conversation/{dialogue_name}")
def add_to_conversation(dialogue_name: str, content: dict, index: int = None, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        write_conversation(dialogue_name, content, index)
        return {"message": "Content written to conversation."}
    except IndexError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """Ensure no model is loaded at startup."""
    global model_pipeline
    model_pipeline = None

@app.on_event("shutdown")
async def shutdown_event():
    """Unload model on shutdown if loaded."""
    global model_pipeline
    if model_pipeline:
        unload_model(model_pipeline)

# Pydantic models for input validation
class LoadModelRequest(BaseModel):
    pip_name: str

class ChatRequest(BaseModel):
    messages: list  # List of messages with roles and content

from fastapi import BackgroundTasks

# A placeholder for storing the last chat response (for simplicity)
last_response = {"status": "processing", "response": None}

def perform_chat_task(messages, generation_args):
    """Perform the chat generation task in the background."""
    global model_pipeline, last_response, loading_status
    try:
        loading_status["chat_generating"] = True
        output = model_pipeline(messages, **generation_args)
        last_response["status"] = "completed"
        last_response["response"] = output[0]["generated_text"]
        loading_status["chat_generating"] = False
    except Exception as e:
        last_response["status"] = "error"
        last_response["response"] = str(e)
        loading_status["chat_generating"] = False

def perform_load_task():
    """Perform the model loading task in the background."""
    global model_pipeline, loading_status
    try:
        loading_status["loading_model"] = True
        model_pipeline = load_model()
        loading_status["loading_model"] = False
    except Exception as e:
        loading_status["loading_model"] = False
        raise e

@app.post("/load_model/")
async def api_load_model(request: LoadModelRequest, background_tasks: BackgroundTasks, api_key: str = Header(...)):
    validate_api_key(api_key)
    global model_pipeline, loading_status
    if model_pipeline is not None:
        raise HTTPException(status_code=400, detail="A model is already loaded. Unload it first.")
    try:
        background_tasks.add_task(perform_load_task)
        return {"message": "Model loading started in the background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start model loading: {str(e)}")

@app.post("/unload_model/")
async def api_unload_model(api_key: str = Header(...)):
    validate_api_key(api_key)
    global model_pipeline
    if model_pipeline is None:
        raise HTTPException(status_code=400, detail="No model is currently loaded.")
    try:
        unload_model(model_pipeline)
        model_pipeline = None
        return {"message": "Model unloaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unload model: {str(e)}")

@app.post("/chat/")
async def api_chat(request: ChatRequest, background_tasks: BackgroundTasks, api_key: str = Header(...)):
    validate_api_key(api_key)
    global model_pipeline, last_response
    if model_pipeline is None:
        raise HTTPException(status_code=400, detail="No model is currently loaded. Please load a model first.")

    # Reset the last response state
    last_response["status"] = "processing"
    last_response["response"] = None

    # Prepare the input messages and generation arguments
    generation_args = {
        "max_new_tokens": max_new_tokens,
        "return_full_text": True,
        "temperature": 0.3,
        "do_sample": True,
    }

    # Add the task to the background queue
    background_tasks.add_task(perform_chat_task, request.messages, generation_args)

    return {"message": "Chat generation started in the background."}

@app.get("/chat-status/")
def chat_status(api_key: str = Header(...)):
    validate_api_key(api_key)
    return last_response

@app.get("/heartbeat")
def heartbeat(api_key: str = Header(...)):
    validate_api_key(api_key)
    return {"status": "alive", "message": "Backend is running."}

@app.get("/load-status/")
def load_status(api_key: str = Header(...)):
    validate_api_key(api_key)
    return {"loading_model": loading_status["loading_model"]}

@app.get("/chat-generation-status/")
def chat_generation_status(api_key: str = Header(...)):
    validate_api_key(api_key)
    return {"chat_generating": loading_status["chat_generating"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
