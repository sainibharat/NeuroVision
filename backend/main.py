"""
FastAPI Server for NeuroVision.
Provides prediction and Grad-CAM explanation endpoints.
"""

import io
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from backend.schemas import HealthResponse, PredictionResponse, ErrorResponse
from backend.inference import get_predictor

app = FastAPI(
    title="NeuroVision API",
    description="Explainable Deep Learning for Brain Tumor Classification from MRI Scans",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite defaults to 5173, Next/CRA to 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "bmp", "tiff", "webp"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB limit


def validate_image_file(file: UploadFile) -> None:
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )


@app.get("/", summary="Root status")
def root():
    return {
        "project": "NeuroVision",
        "description": "Explainable Deep Learning for Brain Tumor Classification from MRI Images",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST multipart/form-data)",
            "explain": "/explain (POST multipart/form-data)"
        }
    }


@app.get("/health", response_model=HealthResponse, summary="Service health check")
def health_check():
    predictor = get_predictor()
    return HealthResponse(
        status="healthy",
        model_loaded=predictor.model is not None,
        model_type=predictor.model_type,
        classes=predictor.classes
    )


@app.post("/predict", response_model=PredictionResponse, summary="Classify brain MRI image with Grad-CAM")
async def predict_mri(
    file: UploadFile = File(..., description="Uploaded MRI image file"),
    explain: bool = Query(True, description="Whether to include Grad-CAM explanation overlay")
):
    validate_image_file(file)

    try:
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds the 15MB limit.")

        image = Image.open(io.BytesIO(contents))
        image.verify()  # Verify image integrity
        image = Image.open(io.BytesIO(contents))  # Re-open after verify
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupted image file: {str(e)}")

    try:
        predictor = get_predictor()
        result = predictor.predict(image, generate_explanation=explain)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/explain", response_model=PredictionResponse, summary="Generate Grad-CAM explanation for MRI scan")
async def explain_mri(file: UploadFile = File(...)):
    # Alias to predict with explain=True
    return await predict_mri(file=file, explain=True)
