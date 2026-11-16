"""
Pydantic Schemas for NeuroVision API.
"""

from typing import Dict, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool
    model_type: str
    classes: list[str]


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    explanation_available: bool
    overlay_base64: Optional[str] = None
    disclaimer: str = (
        "This is an educational and research prototype, not a clinically validated diagnostic system. "
        "Model confidence is not the same as diagnostic certainty."
    )


class ErrorResponse(BaseModel):
    detail: str
