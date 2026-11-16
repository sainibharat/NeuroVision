"""
Model inference module for NeuroVision.
Supports EfficientNet-B0 (default), ResNet18, and Baseline CNN.
"""

import os
import json
from typing import Dict, Any, List
import torch
from torchvision import models
from PIL import Image

from ml.explain import GradCAM, preprocess, overlay, pil_to_base64
from ml.models import BaselineCNN, get_resnet18

DEFAULT_CLASSES = ["glioma", "meningioma", "no_tumor", "pituitary"]


def build_model(model_type: str, num_classes: int) -> torch.nn.Module:
    """Builds model architecture matching the Colab training notebooks."""
    if model_type == "efficientnet_b0" or model_type == "efficientnet":
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier[1] = torch.nn.Linear(in_features, num_classes)
        return model
    elif model_type == "resnet18":
        return get_resnet18(num_classes=num_classes, pretrained=False)
    else:
        return BaselineCNN(num_classes=num_classes)


class NeuroVisionPredictor:
    def __init__(
        self,
        model_path: str = "artifacts/best_model.pth",
        class_names_path: str = "artifacts/class_names.json",
        model_type: str = "efficientnet_b0",
        device: str = None
    ):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model_type = model_type
        self.classes = self._load_classes(class_names_path)
        self.model = build_model(self.model_type, len(self.classes))
        self.model_loaded_from_disk = self._load_checkpoint(model_path)
        self.model.to(self.device).eval()

        # Target layer for Grad-CAM
        if "efficientnet" in self.model_type:
            self.target_layer = self.model.features[-1]
        elif "resnet" in self.model_type:
            self.target_layer = self.model.layer4[-1]
        else:
            self.target_layer = self.model.features[-4]

        self.grad_cam = GradCAM(self.model, self.target_layer)

    def _load_classes(self, path: str) -> List[str]:
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    return json.load(f)
            except Exception:
                pass
        return DEFAULT_CLASSES

    def _load_checkpoint(self, path: str) -> bool:
        # Check primary path or alternative names
        alt_paths = [
            path,
            os.path.join(os.path.dirname(path), "effnet_b0_best.pth"),
            os.path.join(os.path.dirname(path), "best_model.pth")
        ]
        target_path = next((p for p in alt_paths if os.path.exists(p)), None)

        if target_path:
            try:
                ckpt = torch.load(target_path, map_location=self.device)
                if isinstance(ckpt, dict) and "model" in ckpt:
                    self.model.load_state_dict(ckpt["model"])
                elif isinstance(ckpt, dict) and "state_dict" in ckpt:
                    self.model.load_state_dict(ckpt["state_dict"])
                elif isinstance(ckpt, dict) and "model_state_dict" in ckpt:
                    self.model.load_state_dict(ckpt["model_state_dict"])
                else:
                    self.model.load_state_dict(ckpt)
                print(f"[NeuroVisionPredictor] Loaded checkpoint from: {target_path}")
                return True
            except Exception as e:
                print(f"[NeuroVisionPredictor] Checkpoint load failed: {e}")
                return False
        return False

    def predict(
        self,
        image: Image.Image,
        generate_explanation: bool = True,
        class_idx: int = None
    ) -> Dict[str, Any]:
        """
        Runs inference on PIL image and generates Grad-CAM explanation.
        """
        x = preprocess(image).to(self.device)
        cam, probs, pred_idx = self.grad_cam(x, class_idx=class_idx)

        pred_class = self.classes[pred_idx]
        confidence = float(probs[pred_idx])
        prob_dict = {self.classes[i]: float(probs[i]) for i in range(len(self.classes))}

        result = {
            "predicted_class": pred_class,
            "confidence": confidence,
            "probabilities": prob_dict,
            "explanation_available": False,
            "overlay_base64": None,
            "model_checkpoint_loaded": self.model_loaded_from_disk
        }

        if generate_explanation:
            overlay_img = overlay(image, cam)
            result["explanation_available"] = True
            result["overlay_base64"] = pil_to_base64(overlay_img)

        return result
