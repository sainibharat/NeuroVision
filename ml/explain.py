"""
Explainable AI (XAI) using Grad-CAM for Brain Tumor MRI Scans.
Supports generating raw heatmaps and blended overlays.
"""

import io
import base64
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
import matplotlib.cm as cm


class GradCAM:
    """
    Grad-CAM extractor targeting convolutional feature maps.
    """
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        # Register forward and backward hooks
        self._hook_forward()
        self._hook_backward()

    def _hook_forward(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()
        self.target_layer.register_forward_hook(forward_hook)

    def _hook_backward(self):
        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate_heatmap(self, input_tensor: torch.Tensor, class_idx: int = None) -> np.ndarray:
        """
        Generates normalized Grad-CAM heatmap (0.0 to 1.0) of size (H, W).
        """
        self.model.eval()
        self.model.zero_grad()

        # Forward pass
        logits = self.model(input_tensor)

        if class_idx is None:
            class_idx = torch.argmax(logits, dim=1).item()

        score = logits[:, class_idx]
        score.backward(retain_graph=True)

        # Global average pooling of gradients: weights alpha_k
        # gradients shape: [batch, channels, H, W]
        pooled_gradients = torch.mean(self.gradients, dim=[0, 2, 3])

        # Weight the channels by gradients
        activations = self.activations[0]  # [channels, H, W]
        for i in range(len(pooled_gradients)):
            activations[i, :, :] *= pooled_gradients[i]

        # Channel-wise sum and ReLU
        heatmap = torch.mean(activations, dim=0).cpu().numpy()
        heatmap = np.maximum(heatmap, 0)

        # Normalize heatmap between 0 and 1
        max_val = np.max(heatmap)
        if max_val > 0:
            heatmap /= max_val
        else:
            heatmap = np.zeros_like(heatmap)

        return heatmap


def overlay_heatmap_on_image(
    original_img: Image.Image,
    heatmap: np.ndarray,
    alpha: float = 0.45,
    colormap_name: str = "jet"
) -> Image.Image:
    """
    Overlays 2D Grad-CAM heatmap onto a PIL RGB image.
    """
    img_w, img_h = original_img.size

    # Resize heatmap to match image dimensions
    heatmap_pil = Image.fromarray(np.uint8(255 * heatmap)).resize((img_w, img_h), Image.Resampling.BILINEAR)
    heatmap_resized = np.array(heatmap_pil) / 255.0

    # Apply colormap
    colormap = cm.get_cmap(colormap_name)
    colored_heatmap = colormap(heatmap_resized)[:, :, :3]  # RGB values in [0, 1]
    colored_heatmap = np.uint8(255 * colored_heatmap)

    original_np = np.array(original_img.convert("RGB"))
    blended = np.uint8(alpha * colored_heatmap + (1.0 - alpha) * original_np)

    return Image.fromarray(blended)


def pil_to_base64(img: Image.Image, format: str = "PNG") -> str:
    """
    Helper to convert a PIL Image into a base64 encoded string.
    """
    buffered = io.BytesIO()
    img.save(buffered, format=format)
    return base64.b64encode(buffered.getvalue()).decode("utf-8")
