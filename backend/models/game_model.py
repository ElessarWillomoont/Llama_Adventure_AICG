import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import os
import yaml

class ChatModel:
    def __init__(self, config_path=None):
        """
        Initialize the ChatModel class by loading configurations and setting up the environment.

        :param config_path: Path to the YAML configuration file (optional).
        """
        # Get the current and parent directory paths
        self.current_dir = os.path.dirname(__file__)
        self.parent_dir = os.path.abspath(os.path.join(self.current_dir, '..'))

        # Path to the configuration file
        self.config_file_path = config_path or os.path.join(self.parent_dir, 'config.yaml')

        # Load YAML configuration
        with open(self.config_file_path, 'r') as file:
            self.config = yaml.safe_load(file)

        # Detect the appropriate device (GPU or CPU)
        self.device = self.get_device()

        # Load max_new_tokens from config or default to 512
        self.default_max_tokens = self.config.get('max_new_tokens', 512)

        # Initialize model and tokenizer as None (to be loaded later)
        self.model = None
        self.tokenizer = None

    def get_device(self):
        """
        Detects whether a GPU with CUDA support is available and returns the appropriate device.
        """
        if torch.cuda.is_available():
            print("GPU with CUDA support detected. Using GPU.")
            return torch.device("cuda")
        else:
            print("No GPU detected. Using CPU.")
            return torch.device("cpu")

    def load_model(self, model_name="microsoft/Phi-3.5-mini-instruct"):
        """
        Loads the model and tokenizer into memory.
        """
        print(f"Loading model: {model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

        if self.tokenizer.pad_token is None:
            print("pad_token not defined. Setting pad_token to <|endoftext|>.")
            self.tokenizer.pad_token = '<|endoftext|>'

        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            trust_remote_code=True
        ).to(self.device)
        print("Model loaded.")

    def unload_model(self):
        """
        Unloads the model and tokenizer from memory.
        """
        print("Unloading model.")
        del self.model
        del self.tokenizer
        torch.cuda.empty_cache()  # Clear GPU memory
        print("Model unloaded.")

    def adjust_memory_and_generate(self, model, tokenizer, input_text, initial_max_tokens=None):
        """
        Dynamically adjusts memory usage by reducing max_new_tokens in case of OOM errors.
        Includes early stopping when the generation ends.
        """
        max_new_tokens = initial_max_tokens or self.default_max_tokens
        while max_new_tokens > 16:  # Set a reasonable lower limit
            try:
                inputs = tokenizer(
                    input_text,
                    return_tensors="pt",
                    padding=True,
                    truncation=True
                ).to(self.device)

                outputs = model.generate(
                    inputs["input_ids"],
                    attention_mask=inputs.get("attention_mask"),
                    max_new_tokens=max_new_tokens,
                    eos_token_id=tokenizer.eos_token_id,
                    early_stopping=True
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

    def chat_with_manual_inference(self, input_text):
        """
        Generate a response using manual inference for finer control.
        Includes early stopping and randomization.

        :param input_text: User input text.
        :return: Generated response.
        """
        if self.model is None or self.tokenizer is None:
            raise ValueError("Model is not loaded. Please load the model first.")

        initial_prompt = f"User: {input_text}\nAssistant:"
        return self.adjust_memory_and_generate(
            self.model, 
            self.tokenizer, 
            initial_prompt, 
            initial_max_tokens=self.default_max_tokens)

# Usage Example
if __name__ == "__main__":
    chat_model = ChatModel()

    # Load the model
    chat_model.load_model()

    while True:
        user_input = input("Enter your message (or type 'exit_model' to unload): ")

        # Check if the user wants to exit the model
        if user_input.strip().lower() == "exit_model":
            chat_model.unload_model()
            break

        # Respond using manual inference
        response = chat_model.chat_with_manual_inference(user_input)
        print("Assistant response:", response)
