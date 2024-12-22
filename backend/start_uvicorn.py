import multiprocessing
import uvicorn

def calculate_workers(cpu_usage_percentage: float = 0.75):
    """
    Calculate the number of workers based on CPU count and target percentage.
    """
    total_cpus = multiprocessing.cpu_count()
    workers = max(1, int(total_cpus * cpu_usage_percentage))  # Ensure at least 1 worker
    return workers

if __name__ == "__main__":
    # Set desired CPU utilization percentage
    cpu_target = 0.75  # Use 75% of available CPUs
    workers = calculate_workers(cpu_target)

    print(f"Starting Uvicorn with {workers} workers on port 5000")
    
    # Start Uvicorn with the desired configuration
    uvicorn.run(
        "app:app",  # Replace 'app:app' with your FastAPI application instance
        host="0.0.0.0",
        port=5000,  # Ensure port 5000 is used
        workers=workers,
        log_level="info",
    )
