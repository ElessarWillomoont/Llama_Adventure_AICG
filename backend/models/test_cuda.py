import torch

# Check if CUDA is available
cuda_available = torch.cuda.is_available()

# Print CUDA status
print(f"CUDA Available: {cuda_available}")

if cuda_available:
    # Get CUDA version and GPU details
    print(f"CUDA Version: {torch.version.cuda}")
    print(f"Number of GPUs: {torch.cuda.device_count()}")
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
else:
    print("CUDA is not available. Ensure you have a GPU-enabled container and the correct drivers.")
