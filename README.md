# Llama Adventure

## Description

Llama Adventure is a minimal text-based adventure game with a backend powered by Python/Flask and a frontend developed using Next.js. This project was created as part of the AICG class task 2.

## How to Run

### Using Docker (Recommended for beginners)

1. Ensure Docker or Docker Desktop is installed on your system. For detailed installation instructions, visit [this link](https://docs.docker.com/get-started/get-docker/).

2. Clone the repository and navigate to the project root directory:

   ```bash
   git clone <repository-folder>
   cd <repository-folder>
   ```

3. Run the following command to start the application. Note that it may take some time to download the required images:

   ```bash
   docker-compose up
   ```

4. Open your browser and visit:

   ```
   http://localhost:3000/
   ```

   to interact with the frontend.

### Using Separate Frontend and Backend (Recommended for advanced users)

This setup is ideal for users with high-performance computers, real-time requirements, or those seeking a more raw web experience.

1. Clone the repository and copy the frontend and backend directories to your preferred machines or cloud servers.

#### Backend Setup

1. Install the required dependencies using `requirements.txt`. Ensure CUDA is correctly installed and matches the required version (e.g., 12.4).

   ```bash
   pip install -r requirements.txt
   ```

2. Configure `configure.yaml` to include the necessary API keys for securing exposed APIs.

3. Expose the necessary ports.

4. Start the Uvicorn server with the following command (adjust based on your operating system):

   ```bash
   uvicorn app:app --host 0.0.0.0 --port 5000
   ```

#### Frontend Setup

1. Install Node.js dependencies using `package-lock.json`:

   ```bash
   npm install
   ```

2. Configure `configure.yaml` to set the backend server's IP address and API key.

3. Build and start the Node.js server with the following commands:

   ```bash
   npm run build
   npm start
   ```

4. Access the application through the Node.js server for the frontend experience.

## Frontend

Using a Next.js project as the frontend facilitates rapid development of a functional prototype.

### Development Mode

The application includes a development mode controlled by the environment variable `GAME_IS_IN_DEV_MODE`. When set to `"true"`, a toggle button appears at the top-right corner of the page. This button allows users to enable or disable development mode, which activates or hides logs, context, and other non-essential information.

### Animation Heartbeat

The frontend continuously monitors the backend's `heartbeat` API. If communication fails or there is a timeout exceeding 10 seconds, it indicates that the backend might have crashed or disconnected. This feature helps users identify whether the backend is still processing intensive tasks, such as large model generation, or if it requires intervention to address a crash or disconnection.

#### Special Behavior in Debug Mode

In debug mode, this component becomes clickable. When clicked, the component turns yellow and stops sending requests to the backend, while updating the corresponding global variable. This allows developers to pause frequent API requests and debug issues between the frontend and backend more effectively.

## Discussion

### Why use Docker with bulky images?

The use of Docker, despite the inclusion of large images, is aimed at maximizing accessibility for users with no technical background. Docker enables a seamless "download-and-run" experience, which is ideal for beginners. Advanced users, on the other hand, can explore alternative deployment methods, such as deploying the backend and frontend separately, to better suit their specific needs.

### Why use a frontend-backend structure despite its bulkiness?

1. **Specialization:** JavaScript is well-suited for frontend UI development, but it lacks robust support for backend tasks, particularly those involving AI frameworks, where Python excels.

2. **Efficiency:** Bundling everything into the frontend would significantly increase its size (especially model parameters), leading to higher memory usage and slower loading times. Splitting the frontend and backend allows for distributing workloads across two machines, optimizing performance and user experience.

### Why use Transformers instead of more efficient libraries like ONNX Runtime or llama.cpp?

1. **Rapid Prototyping:** Transformers provide an easy-to-use framework that significantly reduces development time. Among the options, it is currently the most accessible framework known to the author.

2. **High Compatibility:** While ONNX Runtime offers high efficiency and compatibility across various devices, it requires a higher learning curve. llama.cpp, though efficient, involves manual compilation, making it less beginner-friendly—especially for users who prefer a straightforward "download-and-run" approach.

3. **Updated Libraries:** The ONNX Runtime `onnxruntime-genai` library was recently updated, and many tutorials have yet to synchronize with the changes, leading to issues where examples currently fail to run. Given the lack of time to debug or wait for updated guides, Transformers were chosen to rapidly develop a minimal viable prototype.

### Why not quantize the model despite its high memory requirements (16GB+ VRAM)?

Quantization in Transformers is not as straightforward as in the original PyTorch framework. Although efforts are underway to address this, switching to a different technology stack requires additional development time. This task is included in the project's to-do list for future improvements.

## To-Do

1. Explore adopting ONNX Runtime for enhanced efficiency.
2. Implement necessary model quantization to enable accessibility on a wider range of devices.

