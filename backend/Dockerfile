# Use the specified PyTorch base image with CUDA 12.4 and cuDNN 9
FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-devel

# Set the working directory in the container
WORKDIR /app

# Copy application files into the container
COPY . /app

# Install FastAPI and other Python packages required by your application
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
