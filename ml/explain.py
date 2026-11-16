"""
Grad-CAM utilities for NeuroVision (aligned directly with Notebook 06 and FastAPI backend).

Educational prototype. A heatmap shows which image regions influenced the model's score for a class;
it is NOT evidence that the highlighted area is a tumor or that the prediction is medically correct.
"""

import io
import base64
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from matplotlib import colormaps

IMG_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


def preprocess(img: Image.Image, size: int = IMG_SIZE, mean=MEAN, std=STD) -> torch.Tensor:
    """PIL image -> (1, 3, size, size) normalized tensor. Identical to training/eval pipeline."""
    a = np.asarray(img.convert("RGB").resize((size, size), Image.BILINEAR), dtype=np.float32) / 255.0
    t = torch.from_numpy(a).permute(2, 0, 1)
    t = (t - torch.tensor(mean).view(3, 1, 1)) / torch.tensor(std).view(3, 1, 1)
    return t.unsqueeze(0)


class GradCAM:
    """
    Grad-CAM for CNN / Transfer Learning models.
    Target layer: last convolutional block (e.g. model.features[-1] for EfficientNet-B0).
    """
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model.eval()
        self.acts = None
        self.grads = None
        self._handle = target_layer.register_forward_hook(self._forward_hook)

    def _forward_hook(self, module, inputs, output):
        self.acts = output.detach()
        if output.requires_grad:
            output.register_hook(lambda g: setattr(self, "grads", g.detach()))

    def remove(self):
        self._handle.remove()

    def __call__(self, x: torch.Tensor, class_idx=None):
        """
        x: (1, 3, H, W) normalized tensor on model's device.
        class_idx=None explains predicted class.
        Returns: (cam[H, W] in [0, 1], probs[n_classes], class_idx)
        """
        self.model.zero_grad(set_to_none=True)
        with torch.enable_grad():
            x = x.detach().clone().requires_grad_(True)
            logits = self.model(x)
            probs = torch.softmax(logits, dim=1)[0].detach().cpu().numpy()
            idx = int(logits.argmax(dim=1)) if class_idx is None else int(class_idx)
            logits[0, idx].backward()

        weights = self.grads.mean(dim=(2, 3), keepdim=True)
        cam = F.relu((weights * self.acts).sum(dim=1, keepdim=True))
        cam = F.interpolate(cam, size=x.shape[-2:], mode="bilinear", align_corners=False)[0, 0]
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)
        return cam.cpu().numpy().astype(np.float32), probs, idx


def heatmap_image(cam: np.ndarray, cmap: str = "jet") -> Image.Image:
    """Converts 2D normalized cam to a colored PIL Image."""
    return Image.fromarray((colormaps[cmap](cam)[..., :3] * 255).astype(np.uint8))


def overlay(img: Image.Image, cam: np.ndarray, alpha: float = 0.45, cmap: str = "jet") -> Image.Image:
    """Blend the heatmap over the original image."""
    h, w = cam.shape
    base = np.asarray(img.convert("RGB").resize((w, h), Image.BILINEAR), dtype=np.float32)
    heat = np.asarray(heatmap_image(cam, cmap), dtype=np.float32)
    return Image.fromarray(((1 - alpha) * base + alpha * heat).clip(0, 255).astype(np.uint8))


def pil_to_base64(img: Image.Image, format: str = "PNG") -> str:
    buffered = io.BytesIO()
    img.save(buffered, format=format)
    return base64.b64encode(buffered.getvalue()).decode("utf-8")
