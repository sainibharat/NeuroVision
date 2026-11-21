# Production Dockerfile for NeuroVision FastAPI Backend
FROM python:3.11-slim

# Avoid prompts from debian and disable pip cache
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies for OpenCV and image operations
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU first to minimize container size (if GPU is needed, replace with CUDA wheel)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining backend requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy application code and model artifacts
COPY backend /app/backend
COPY ml /app/ml
COPY artifacts /app/artifacts

EXPOSE 8000

# Run FastAPI via Uvicorn respecting dynamic cloud $PORT
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
