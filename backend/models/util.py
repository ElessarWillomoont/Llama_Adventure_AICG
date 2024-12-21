import os
import yaml

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