# Use the specified PyTorch base image with CUDA 12.4 and cuDNN 9
FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime

# Set the working directory in the container
WORKDIR /app

# Copy application files into the container
COPY . /app

# Install system dependencies
# RUN apt-get update && apt-get install -y git && apt-get clean

# Install Python packages required by your application
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 to allow external access
EXPOSE 5000

# Command to run the Python script for Uvicorn
CMD ["python", "app.py"]
