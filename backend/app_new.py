from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models.model_new import load_model, unload_model
from models.util import (
    new_conversation,
    read_conversation,
    write_conversation,
    generate_response,
    summarize_conversation,
)

# Initialize FastAPI app
app = FastAPI()

# Global pipeline for the model
model_pipeline = None

@app.on_event("startup")
async def startup_event():
    """Load the model when the API starts."""
    global model_pipeline
    model_pipeline = load_model()

@app.on_event("shutdown")
async def shutdown_event():
    """Unload the model when the API shuts down."""
    global model_pipeline
    if model_pipeline:
        unload_model(model_pipeline)

# Pydantic models for input and output validation
class UserInput(BaseModel):
    dialogue_name: str
    input_text: str

class SummaryRequest(BaseModel):
    dialogue_name: str

@app.post("/start_conversation/")
async def start_conversation(dialogue_name: str):
    """Initialize a new conversation."""
    try:
        path = new_conversation(dialogue_name)
        return {"message": f"Conversation {dialogue_name} initialized.", "path": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_conversation/")
async def get_conversation(dialogue_name: str):
    """Retrieve conversation history."""
    try:
        history = read_conversation(dialogue_name)
        return {"dialogue_name": dialogue_name, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_response/")
async def generate_user_response(user_input: UserInput):
    """Generate a model response for the user's input."""
    global model_pipeline
    try:
        generate_response(user_input.dialogue_name, user_input.input_text, model_pipeline)
        history = read_conversation(user_input.dialogue_name)
        return {"dialogue_name": user_input.dialogue_name, "updated_history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize_conversation/")
async def summarize_history(summary_request: SummaryRequest):
    """Summarize the entire conversation."""
    global model_pipeline
    try:
        summary = summarize_conversation(summary_request.dialogue_name, model_pipeline)
        return {"dialogue_name": summary_request.dialogue_name, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "FastAPI is running for model interactions!"}
