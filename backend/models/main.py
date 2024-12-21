import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import os
import yaml

# Get the current and parent directory paths
current_dir = os.path.dirname(__file__)
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))

# Path to the configuration file
config_file_path = os.path.join(parent_dir, 'config.yaml')

# Load YAML configuration
with open(config_file_path, 'r') as file:
    config = yaml.safe_load(file)

# Function to detect the appropriate device (GPU or CPU)
def get_device():
    """
    Detects whether a GPU with CUDA support is available and returns the appropriate device.
    """
    if torch.cuda.is_available():
        print("GPU with CUDA support detected. Using GPU.")
        return torch.device("cuda")
    else:
        print("No GPU detected. Using CPU.")
        return torch.device("cpu")

# Function to check and adjust memory usage dynamically
def adjust_memory_and_generate(model, tokenizer, input_text, device, initial_max_tokens=512):
    """
    Dynamically adjusts memory usage by reducing max_new_tokens in case of OOM errors.
    """
    max_new_tokens = initial_max_tokens
    while max_new_tokens > 16:  # Set a reasonable lower limit
        try:
            inputs = tokenizer(
                input_text,
                return_tensors="pt",
                padding=True,
                truncation=True
            ).to(device)

            outputs = model.generate(
                inputs["input_ids"],
                attention_mask=inputs.get("attention_mask"),
                max_new_tokens=max_new_tokens,
                eos_token_id=tokenizer.eos_token_id
            )
            return tokenizer.decode(outputs[0], skip_special_tokens=True)
        except RuntimeError as e:
            if "CUDA out of memory" in str(e):
                print(f"Out of memory with max_new_tokens={max_new_tokens}. Reducing token limit...")
                max_new_tokens //= 2
                torch.cuda.empty_cache()
            else:
                raise e
    raise RuntimeError("Unable to generate response even with reduced token limits.")

# High-level interaction using pipeline
def chat_with_pipeline(input_text, device):
    """
    Generate a response using the pipeline API for high-level interaction.
    Ensures response generation stops early and uses optimized settings.
    """
    pipe = pipeline(
        "text-generation",
        model="microsoft/Phi-3.5-mini-instruct",
        device=0 if device.type == "cuda" else -1,
        trust_remote_code=True
    )
    max_new_tokens = 1024  # Start with a lower token limit

    while max_new_tokens > 16:
        try:
            messages = [{"role": "user", "content": input_text}]
            response = pipe(
                messages,
                max_new_tokens=max_new_tokens
            )
            return response[0]['generated_text']
        except RuntimeError as e:
            if "CUDA out of memory" in str(e):
                print(f"Out of memory with max_new_tokens={max_new_tokens}. Reducing token limit...")
                max_new_tokens //= 2
                torch.cuda.empty_cache()
            else:
                raise e
    raise RuntimeError("Unable to generate response even with reduced token limits.")

# Fine-grained control using model and tokenizer
def chat_with_manual_inference(input_text, device):
    """
    Generate a response using manual inference for finer control.
    """
    tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct", trust_remote_code=True)

    # Ensure the tokenizer has necessary tokens
    if tokenizer.pad_token is None:
        print("pad_token not defined. Setting pad_token to <|endoftext|>.")
        tokenizer.pad_token = '<|endoftext|>'

    model = AutoModelForCausalLM.from_pretrained(
        "microsoft/Phi-3.5-mini-instruct",
        trust_remote_code=True
    ).to(device)

    initial_prompt = f"User: {input_text}\nAssistant:"
    return adjust_memory_and_generate(model, tokenizer, initial_prompt, device)

if __name__ == "__main__":
    device = get_device()
    input_text = input("Enter your message: ")
    print("Pipeline response:", chat_with_pipeline(input_text, device))
    # Uncomment the line below for manual inference
    # print("Manual inference response:", chat_with_manual_inference(input_text, device))
