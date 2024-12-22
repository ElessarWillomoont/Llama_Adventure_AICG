from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models.model_new import load_model, unload_model, interactive_session, get_device

app = FastAPI()

# Global variable for model pipeline
model_pipeline = None

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
async def api_load_model(request: LoadModelRequest):
    """Load the model using its pip name."""
    global model_pipeline
    if model_pipeline is not None:
        raise HTTPException(status_code=400, detail="A model is already loaded. Unload it first.")
    try:
        # Load the model (uses the `load_model` function from `model_new.py`)
        print(f"Loading model: {request.pip_name}")
        model_pipeline = load_model()
        return {"message": f"Model '{request.pip_name}' loaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

@app.post("/unload_model/")
async def api_unload_model():
    """Unload the currently loaded model."""
    global model_pipeline
    if model_pipeline is None:
        raise HTTPException(status_code=400, detail="No model is currently loaded.")
    try:
        # Unload the model (uses the `unload_model` function from `model_new.py`)
        unload_model(model_pipeline)
        model_pipeline = None
        return {"message": "Model unloaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unload model: {str(e)}")

@app.post("/chat/")
async def api_chat(request: ChatRequest):
    """Chat interactively with the model."""
    global model_pipeline
    if model_pipeline is None:
        raise HTTPException(status_code=400, detail="No model is currently loaded. Please load a model first.")
    try:
        # Use the `interactive_session` logic from `model_new.py` but adapt for single-response API
        max_new_tokens = 512  # Customize as needed
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
        output = model_pipeline(messages, **generation_args)
        return {"user_input": request.user_input, "response": output[0]["generated_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint for status checking."""
    return {"message": "FastAPI is running for model interactions!"}
