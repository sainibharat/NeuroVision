"""
Backend inference manager for NeuroVision.
Maintains a singleton Predictor instance to avoid reloading models on every request.
"""

import os
import sys
from PIL import Image

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.predict import NeuroVisionPredictor

_predictor_instance = None


def get_predictor() -> NeuroVisionPredictor:
    """
    Returns the cached NeuroVisionPredictor singleton.
    """
    global _predictor_instance
    if _predictor_instance is None:
        model_path = os.path.join(PROJECT_ROOT, "artifacts", "best_model.pth")
        classes_path = os.path.join(PROJECT_ROOT, "artifacts", "class_names.json")
        _predictor_instance = NeuroVisionPredictor(
            model_path=model_path,
            class_names_path=classes_path,
            model_type="resnet18"
        )
    return _predictor_instance
