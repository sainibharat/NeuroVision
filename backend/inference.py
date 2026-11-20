"""
Backend inference manager for NeuroVision.
Maintains a singleton Predictor instance to load the trained model once on startup.
"""

import os
import sys

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.predict import NeuroVisionPredictor

_predictor_instance = None


def get_predictor() -> NeuroVisionPredictor:
    """
    Returns the cached NeuroVisionPredictor singleton.
    Loads artifacts/best_model.pth and artifacts/class_names.json on first access.
    """
    global _predictor_instance
    if _predictor_instance is None:
        model_path = os.path.join(PROJECT_ROOT, "artifacts", "best_model.pth")
        classes_path = os.path.join(PROJECT_ROOT, "artifacts", "class_names.json")
        _predictor_instance = NeuroVisionPredictor(
            model_path=model_path,
            class_names_path=classes_path
        )
        _predictor_instance.model_type = "EfficientNet-B0"
    return _predictor_instance
