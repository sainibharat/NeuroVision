"""
Tests for NeuroVision PyTorch models.
"""

import pytest
import torch
from ml.models import BaselineCNN, get_resnet18, get_efficientnet_b0


def test_baseline_cnn_forward():
    model = BaselineCNN(num_classes=4)
    model.eval()
    dummy_input = torch.randn(2, 3, 224, 224)
    output = model(dummy_input)
    assert output.shape == (2, 4), f"Expected shape (2, 4), got {output.shape}"


def test_resnet18_forward():
    model = get_resnet18(num_classes=4, pretrained=False)
    model.eval()
    dummy_input = torch.randn(2, 3, 224, 224)
    output = model(dummy_input)
    assert output.shape == (2, 4), f"Expected shape (2, 4), got {output.shape}"
