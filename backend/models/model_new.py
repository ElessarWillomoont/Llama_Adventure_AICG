import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import os
import yaml

def get_max_new_tokens(config_path="config.yaml"):
    """Read max_new_tokens from the configuration file or default to 512."""
    if os.path.exists(config_path):
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
            return config.get('max_new_tokens', 512)
    return 512

def get_device():
    """Detect whether the device supports CUDA and return the appropriate device."""
    if torch.cuda.is_available():
        print("GPU with CUDA support detected. Using GPU.")
        return torch.device("cuda")
    else:
        print("No GPU detected. Using CPU.")
        return torch.device("cpu")

def load_model():
    """Load the Phi-3.5-mini-instruct model onto GPU."""
    print("Loading model to GPU...")
    model = AutoModelForCausalLM.from_pretrained(
        "microsoft/Phi-3.5-mini-instruct",
        device_map="cuda",
        torch_dtype="auto",
        trust_remote_code=True,
    )
    tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct")
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )
    print("Model loaded successfully!")
    return pipe

def interactive_session(pipe):
    """
    
    Start an interactive session with the user.
    not used as made another way to fulfill in api 
    
    """
    print("\nInteractive session started. Type 'exit' to quit.")
    max_new_tokens = get_max_new_tokens()
    generation_args = {
        "max_new_tokens": max_new_tokens,
        "return_full_text": False,
        "temperature": 0.3,
        "do_sample": True,
    }

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Exiting session...")
            break

        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": user_input},
        ]

        try:
            output = pipe(messages, **generation_args)
            print("AI:", output[0]["generated_text"])
        except Exception as e:
            print("Error generating response:", e)

def unload_model(pipe):
    """Unload the model from GPU to free memory."""
    print("Unloading model from GPU...")
    del pipe
    torch.cuda.empty_cache()
    print("Model successfully unloaded.")

if __name__ == "__main__":
    # Step 1: Load the model
    device = get_device()
    pipe = load_model()

    try:
        # Step 2: Start interactive session
        interactive_session(pipe)
    finally:
        # Step 3: Unload the model
        unload_model(pipe)
