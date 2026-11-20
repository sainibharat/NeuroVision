"""
Pydantic Schemas for NeuroVision API (Blueprint Section 10 & 13).
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool
    model_type: str = "EfficientNet-B0"
    classes: List[str]
    device: str


class PredictionResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    explanation_available: bool = True
    overlay_base64: Optional[str] = None
    heatmap_base64: Optional[str] = None
    checkpoint_loaded: Optional[bool] = True
    disclaimer: str = (
        "Educational and research prototype. Not a clinically validated diagnostic system. "
        "Model confidence is not the same as diagnostic certainty."
    )


class MetricsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    model: str
    n_test: int
    test: Dict[str, object]
    disclaimer: str
