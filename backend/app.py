from fastapi import FastAPI, Header, HTTPException
import yaml

# Load API key from config.yaml
with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)
API_KEY = config.get("API_KEY", "default_key")

app = FastAPI()

@app.get("/test-communication")
def test_communication(api_key: str = Header(...)):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return {"message": "Hallo World!"}
