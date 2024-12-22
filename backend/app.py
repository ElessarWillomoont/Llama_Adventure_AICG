from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yaml
from models.util import init_db_dir, new_conversation, read_conversation, write_conversation, process_dialogue, generate_response, summarize_conversation
from models.model_new import load_model, unload_model
from pydantic import BaseModel

# Load configuration from config.yaml
with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)
API_KEY = config.get("API_KEY", "default_key")
FRONTEND_URL = config.get("FRONTEND_URL", "http://localhost:3000")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Allow requests from your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Global variable for the model pipeline
model_pipeline = None

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

@app.post("/process-dialogue/{dialogue_name}")
def process_conversation(dialogue_name: str, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        process_dialogue(dialogue_name)
        return {"message": "Dialogue processed with model."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-response/{dialogue_name}")
def generate_model_response(dialogue_name: str, input_text: str, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        generate_response(dialogue_name, input_text)
        return {"message": "Response generated and added to conversation."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/summarize-conversation/{dialogue_name}")
def summarize_conversation_history(dialogue_name: str, api_key: str = Header(...)):
    validate_api_key(api_key)
    try:
        summary = summarize_conversation(dialogue_name)
        return {"message": "Conversation summarized.", "summary": summary}
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
    user_input: str

@app.post("/load_model/")
async def api_load_model(request: LoadModelRequest, api_key: str = Header(...)):
    validate_api_key(api_key)
    global model_pipeline
    if model_pipeline is not None:
        raise HTTPException(status_code=400, detail="A model is already loaded. Unload it first.")
    try:
        model_pipeline = load_model()
        return {"message": f"Model '{request.pip_name}' loaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

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
async def api_chat(request: ChatRequest, api_key: str = Header(...)):
    validate_api_key(api_key)
    global model_pipeline
    if model_pipeline is None:
        raise HTTPException(status_code=400, detail="No model is currently loaded. Please load a model first.")
    try:
        max_new_tokens = 1024  # Customize as needed
        generation_args = {
            "max_new_tokens": max_new_tokens,
            "return_full_text": True,
            "temperature": 0.7,
            "do_sample": True,
        }
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": request.user_input},
        ]
        # Call the pipeline synchronously
        output = model_pipeline(messages, **generation_args)
        return {"user_input": request.user_input, "response": output[0]["generated_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/heartbeat")
def heartbeat(api_key: str = Header(...)):
    validate_api_key(api_key)
    return {"status": "alive", "message": "Backend is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
