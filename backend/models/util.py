import os
import yaml
from models.model_new import load_model, unload_model, interactive_session
import multiprocessing
import time

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

def process_dialogue(dialogue_name, model="microsoft/Phi-3.5-mini-instruct"):
    """
    Process dialogue history with a specified model.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :param model: Model name to use for processing (default: microsoft/Phi-3.5-mini-instruct).
    """
    pipe = load_model()
    try:
        history = read_conversation(dialogue_name)
        max_new_tokens = 512  # Example setting
        for entry in history:
            if isinstance(entry, dict) and "user" in entry:
                input_text = entry["user"]
                generated = pipe(input_text, max_new_tokens=max_new_tokens)
                entry["assistant"] = generated[0]["generated_text"]
        write_conversation(dialogue_name, history)
    finally:
        unload_model(pipe)

def generate_response(dialogue_name, input_text, model="microsoft/Phi-3.5-mini-instruct"):
    """
    Generate a response for a single user input and update the conversation.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :param input_text: User input for the model.
    :param model: Model name to use for generating response.
    """
    pipe = load_model()
    try:
        response = pipe(input_text, max_new_tokens=512)
        write_conversation(dialogue_name, {"user": input_text, "assistant": response[0]["generated_text"]})
    finally:
        unload_model(pipe)

def summarize_conversation(dialogue_name, model="microsoft/Phi-3.5-mini-instruct"):
    """
    Summarize the entire conversation history.

    :param dialogue_name: Name of the dialogue (used as the file name).
    :param model: Model name to use for summarization.
    """
    pipe = load_model()
    try:
        history = read_conversation(dialogue_name)
        conversation_text = "\n".join([f"User: {entry['user']}\nAssistant: {entry['assistant']}" for entry in history if isinstance(entry, dict)])
        summary = pipe(conversation_text, max_new_tokens=512)
        return summary[0]["generated_text"]
    finally:
        unload_model(pipe)

def interactive_session_with_name(dialogue_name):
    """
    Load an interactive session with the model and store the dialogue name.

    :param dialogue_name: Name of the dialogue to store the alias.
    """
    pipe = load_model()
    try:
        print(f"Starting interactive session for dialogue: {dialogue_name}")
        interactive_session(pipe)
    finally:
        unload_model(pipe)

def heartbeat():
    """
    Display a heartbeat to indicate the program is running.
    """
    for i in range(121):
        print(f"Heartbeat: {i}")
        time.sleep(1)

if __name__ == "__main__":
    dialogue_name = "test_conversation"

    # Start heartbeat in a separate process
    heartbeat_process = multiprocessing.Process(target=heartbeat)
    heartbeat_process.start()

    try:
        # Test new conversation creation
        print("Creating new conversation...")
        print(new_conversation(dialogue_name))

        # Test writing to conversation
        print("Writing to conversation...")
        write_conversation(dialogue_name, {"user": "Hi", "assistant": "Hello!"})
        write_conversation(dialogue_name, {"user": "How are you?", "assistant": "I am fine, thanks!"})

        # Test processing dialogue with model
        print("Processing dialogue with model...")
        process_dialogue(dialogue_name)

        # Test generating a response
        print("Generating a response...")
        generate_response(dialogue_name, "What is your name?")

        # Test summarizing the conversation
        print("Summarizing conversation...")
        print(summarize_conversation(dialogue_name))

        # Test interactive session with dialogue name
        print("Starting interactive session...")
        interactive_session_with_name(dialogue_name)
    finally:
        # Ensure heartbeat process is terminated
        heartbeat_process.terminate()
        heartbeat_process.join()
