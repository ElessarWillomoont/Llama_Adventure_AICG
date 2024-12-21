import os
import yaml
from game_model import ChatModel

# Utility functions to handle YAML-based dialogue history

def init_db_dir():
    """
    Initialize the db directory if it does not exist.
    """
    current_dir = os.path.dirname(__file__)
    db_dir = os.path.abspath(os.path.join(current_dir, '..', 'db'))
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    return db_dir

def new_conversation(dialogue_name):
    """
    Create a new YAML file to represent the dialogue history.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :return: Path to the new YAML file.
    """
    db_dir = init_db_dir()
    file_path = os.path.join(db_dir, f"{dialogue_name}.yaml")
    if not os.path.exists(file_path):
        with open(file_path, 'w') as file:
            yaml.dump(["# Conversation history initialized"], file)  # Add a placeholder comment
    return file_path

def read_conversation(dialogue_name, index=None):
    """
    Read content from a YAML file representing a dialogue history.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :param index: Optional; an index or range to filter the output.
    :return: Filtered dialogue history or all history.
    """
    db_dir = init_db_dir()
    file_path = os.path.join(db_dir, f"{dialogue_name}.yaml")

    if not os.path.exists(file_path):
        file_path = new_conversation(dialogue_name)

    with open(file_path, 'r') as file:
        history = yaml.safe_load(file) or []

    if index is None:
        return history

    if isinstance(index, int):
        return history[index:index+1] if 0 <= index < len(history) else []

    if isinstance(index, slice):
        return history[index]

    return []

def write_conversation(dialogue_name, content, index=None):
    """
    Write or update content in a YAML file representing a dialogue history.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :param content: Content to be written to the dialogue history.
    :param index: Optional; index to overwrite specific entry. If None, append to the end.
    """
    db_dir = init_db_dir()
    file_path = os.path.join(db_dir, f"{dialogue_name}.yaml")

    if not os.path.exists(file_path):
        file_path = new_conversation(dialogue_name)

    with open(file_path, 'r') as file:
        history = yaml.safe_load(file) or []

    if index is None:
        history.append(content)
    elif isinstance(index, int) and 0 <= index < len(history):
        history[index] = content
    else:
        raise IndexError("Invalid index for writing to conversation history.")

    with open(file_path, 'w') as file:
        yaml.dump(history, file)

# Model management and interaction
models_cache = {}

def load_model(model_name):
    """
    Load a ChatModel into memory and cache it.

    :param model_name: Name of the model to load.
    :return: The loaded ChatModel instance.
    """
    if model_name not in models_cache:
        print(f"Loading model: {model_name}")
        chat_model = ChatModel()
        chat_model.load_model(model_name)  # Ensure the model is loaded
        models_cache[model_name] = chat_model
    else:
        print(f"Model {model_name} is already loaded.")
    return models_cache[model_name]

def unload_model(model_name):
    """
    Unload a ChatModel from memory to free resources.

    :param model_name: Name of the model to unload.
    """
    if model_name in models_cache:
        print(f"Unloading model: {model_name}")
        models_cache[model_name].unload_model()  # Unload using the `ChatModel` method
        del models_cache[model_name]
    else:
        print(f"Model {model_name} is not loaded.")

def interact_with_model(model_name, input_text):
    """
    Interact with a loaded ChatModel by providing input and retrieving output.

    :param model_name: Name of the loaded model.
    :param input_text: Input text to send to the model.
    :return: Model's response.
    """
    if model_name not in models_cache:
        raise ValueError(f"Model {model_name} is not loaded. Please load it first.")

    model = models_cache[model_name]
    return model.chat_with_manual_inference(input_text)

# Testing and Initialization Example
if __name__ == "__main__":
    dialogue_name = "test_conversation"

    # Test new conversation creation
    print("Creating new conversation...")
    print(new_conversation(dialogue_name))

    # Test writing to conversation
    print("Writing to conversation...")
    write_conversation(dialogue_name, {"user": "Hi", "assistant": "Hello!"})
    write_conversation(dialogue_name, {"user": "How are you?", "assistant": "I am fine, thanks!"})

    # Test reading from conversation
    print("Reading all conversation...")
    print(read_conversation(dialogue_name))

    print("Reading specific entry...")
    print(read_conversation(dialogue_name, index=1))

    print("Overwriting a specific entry...")
    write_conversation(dialogue_name, {"user": "Are you okay?", "assistant": "Yes, thank you!"}, index=1)

    print("Reading all conversation again...")
    print(read_conversation(dialogue_name))

    # Test model loading, interaction, and unloading
    model_name = input("Enter model name (e.g., 'microsoft/Phi-3.5-mini-instruct'):\n")
    chat_model = load_model(model_name)  # Correct way to load the model

    context = input("Type to start interaction:\n")
    while context.strip().lower() != "exit":
        print("Interacting with model...")
        response = interact_with_model(model_name, context)
        print("Model response:", response)
        write_conversation(dialogue_name, {"user": context, "assistant": response})
        context = input("Enter next message or type 'exit' to unload the model:\n")

    # Unload model
    unload_model(model_name)  # Unload the model correctly
