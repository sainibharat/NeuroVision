"""
NeuroVision Inference Engine.

Wraps the champion EfficientNet-B0 model and Grad-CAM for production prediction.
"""

import os
import json
from typing import Dict, Any, List, Optional
import torch
from PIL import Image

from ml.models import build_model
from ml.explain import GradCAM, explain_image, preprocess, overlay, pil_to_base64

DEFAULT_CLASSES = ["glioma", "meningioma", "no_tumor", "pituitary"]


class NeuroVisionPredictor:
    """
    Production inference service for NeuroVision.
    Loads trained weights and attaches Grad-CAM to model.features[-1].
    """
    def __init__(
        self,
        model_path: str = "artifacts/best_model.pth",
        class_names_path: str = "artifacts/class_names.json",
        device: Optional[str] = None
    ):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = self._load_classes(class_names_path)
        self.model = build_model(n_classes=len(self.classes))
        self.checkpoint_loaded = self._load_weights(model_path)
        self.model.to(self.device).eval()

        # Target layer for Grad-CAM on EfficientNet-B0 is the final conv block: model.features[-1]
        self.target_layer = self.model.features[-1]
        self.grad_cam = GradCAM(self.model, self.target_layer)

    def _load_classes(self, path: str) -> List[str]:
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    return json.load(f)
            except Exception:
                pass
        return DEFAULT_CLASSES

    def _load_weights(self, path: str) -> bool:
        if not os.path.exists(path):
            return False

        try:
            ckpt = torch.load(path, map_location=self.device, weights_only=False)
            if isinstance(ckpt, dict) and "model" in ckpt:
                self.model.load_state_dict(ckpt["model"])
            elif isinstance(ckpt, dict) and "state_dict" in ckpt:
                self.model.load_state_dict(ckpt["state_dict"])
            elif isinstance(ckpt, dict) and "model_state_dict" in ckpt:
                self.model.load_state_dict(ckpt["model_state_dict"])
            else:
                self.model.load_state_dict(ckpt)
            return True
        except Exception as e:
            print(f"[NeuroVisionPredictor] Checkpoint load warning: {e}")
            return False

    def predict(
        self,
        image: Image.Image,
        generate_explanation: bool = True,
        class_idx: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Runs inference on a PIL image and returns predicted class, probabilities,
        and Grad-CAM heatmap visualizations.
        """
        if generate_explanation:
            result = explain_image(
                self.model,
                self.grad_cam,
                image,
                self.classes,
                self.device,
                class_idx=class_idx
            )
            result["explanation_available"] = True
            result["checkpoint_loaded"] = self.checkpoint_loaded
            return result
        else:
            x = preprocess(image).to(self.device)
            with torch.no_grad():
                logits = self.model(x)
                probs = torch.softmax(logits, dim=1)[0].cpu().numpy()
                idx = int(logits.argmax(dim=1))

            return {
                "predicted_class": self.classes[idx],
                "confidence": float(probs[idx]),
                "probabilities": {c: float(p) for c, p in zip(self.classes, probs)},
                "explanation_available": False,
                "checkpoint_loaded": self.checkpoint_loaded
            }
