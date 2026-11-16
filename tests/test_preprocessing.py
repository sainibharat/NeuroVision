"""
Tests for NeuroVision preprocessing pipeline.
"""

from PIL import Image
import torch
from ml.dataset import get_transforms, get_inference_transform


def test_inference_transform():
    transform = get_inference_transform(img_size=224)
    dummy_img = Image.new("RGB", (300, 400), color=(128, 128, 128))
    tensor = transform(dummy_img)

    assert tensor.shape == (3, 224, 224), f"Expected shape (3, 224, 224), got {tensor.shape}"
    assert isinstance(tensor, torch.Tensor)
