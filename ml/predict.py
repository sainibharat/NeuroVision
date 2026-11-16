"""
Model inference module for NeuroVision.
"""

import os
import json
from typing import Dict, Any, Tuple
import torch
import torch.nn.functional as F
from PIL import Image

from ml.models import get_resnet18, BaselineCNN, get_efficientnet_b0
from ml.dataset import get_inference_transform
from ml.explain import GradCAM, overlay_heatmap_on_image, pil_to_base64

DEFAULT_CLASSES = ["glioma", "meningioma", "notumor", "pituitary"]


class NeuroVisionPredictor:
    def __init__(
        self,
        model_path: str = "artifacts/best_model.pth",
        class_names_path: str = "artifacts/class_names.json",
        model_type: str = "resnet18",
        device: str = None
    ):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model_type = model_type
        self.classes = self._load_classes(class_names_path)
        self.model = self._load_model(model_path, len(self.classes))
        self.transform = get_inference_transform()

        # Target layer for Grad-CAM
        if self.model_type == "resnet18":
            self.target_layer = self.model.layer4[-1]
        elif self.model_type == "efficientnet":
            self.target_layer = self.model.features[-1]
        else:
            self.target_layer = self.model.features[-4]

        self.grad_cam = GradCAM(self.model, self.target_layer)

    def _load_classes(self, path: str):
        if os.path.exists(path):
            with open(path, "r") as f:
                return json.load(f)
        return DEFAULT_CLASSES

    def _load_model(self, path: str, num_classes: int) -> torch.nn.Module:
        if self.model_type == "resnet18":
            model = get_resnet18(num_classes=num_classes, pretrained=False)
        elif self.model_type == "efficientnet":
            model = get_efficientnet_b0(num_classes=num_classes, pretrained=False)
        else:
            model = BaselineCNN(num_classes=num_classes)

        if os.path.exists(path):
            checkpoint = torch.load(path, map_location=self.device)
            if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
                model.load_state_dict(checkpoint["state_dict"])
            elif isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                model.load_state_dict(checkpoint["model_state_dict"])
            else:
                model.load_state_dict(checkpoint)

        model.to(self.device)
        model.eval()
        return model

    def predict(
        self,
        image: Image.Image,
        generate_explanation: bool = True
    ) -> Dict[str, Any]:
        """
        Runs inference on a PIL image.
        Returns predicted class, probabilities, confidence, and Grad-CAM base64 image.
        """
        # Ensure 3-channel RGB
        rgb_image = image.convert("RGB")
        input_tensor = self.transform(rgb_image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(input_tensor)
            probabilities = F.softmax(logits, dim=1).cpu().numpy()[0]

        pred_idx = int(probabilities.argmax())
        pred_class = self.classes[pred_idx]
        confidence = float(probabilities[pred_idx])

        prob_dict = {
            self.classes[i]: float(probabilities[i]) for i in range(len(self.classes))
        }

        result = {
            "predicted_class": pred_class,
            "confidence": confidence,
            "probabilities": prob_dict,
            "explanation_available": False,
            "heatmap_base64": None,
            "overlay_base64": None
        }

        if generate_explanation:
            # Enable gradients specifically for Grad-CAM
            with torch.enable_grad():
                input_tensor_grad = self.transform(rgb_image).unsqueeze(0).to(self.device)
                heatmap = self.grad_cam.generate_heatmap(input_tensor_grad, class_idx=pred_idx)
                overlay = overlay_heatmap_on_image(rgb_image.resize((224, 224)), heatmap)

                result["explanation_available"] = True
                result["overlay_base64"] = pil_to_base64(overlay)

        return result
