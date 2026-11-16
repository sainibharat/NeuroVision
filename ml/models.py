"""
NeuroVision Model Architectures (100% aligned with Notebooks 02, 03, 04, 05).

Includes:
1. BaselineCNN: 4-block CNN (1,174,244 parameters, from Notebook 02)
2. ResNet-18: Pretrained ImageNet transfer backbone with dropout head (from Notebook 03)
3. EfficientNet-B0: Selected champion architecture (4,012,672 parameters, from Notebooks 04 & 05)
"""

import torch
import torch.nn as nn
from torchvision import models


def conv_block(in_channels: int, out_channels: int) -> nn.Sequential:
    """Standard double-conv block with BatchNorm and MaxPool from Notebook 02."""
    return nn.Sequential(
        nn.Conv2d(in_channels, out_channels, 3, padding=1, bias=False),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True),
        nn.Conv2d(out_channels, out_channels, 3, padding=1, bias=False),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True),
        nn.MaxPool2d(2)
    )


class BaselineCNN(nn.Module):
    """
    Baseline Convolutional Neural Network from Notebook 02.
    Architecture: 4 double-conv blocks + AdaptiveAvgPool + Linear head.
    Total parameters: ~1.17M
    """
    def __init__(self, n_classes: int = 4):
        super().__init__()
        self.features = nn.Sequential(
            conv_block(3, 32),
            conv_block(32, 64),
            conv_block(64, 128),
            conv_block(128, 256)
        )
        self.head = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Dropout(0.4),
            nn.Linear(256, n_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.head(self.features(x))


def build_resnet18(n_classes: int = 4, pretrained: bool = False) -> nn.Module:
    """
    Pretrained ResNet-18 from Notebook 03.
    Replaces model.fc with Dropout(0.3) + Linear(512, n_classes).
    Target layer for Grad-CAM: model.layer4[-1]
    """
    weights = models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.resnet18(weights=weights)
    model.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.fc.in_features, n_classes)
    )
    return model


def build_effnet_b0(n_classes: int = 4, pretrained: bool = False) -> nn.Module:
    """
    Pretrained EfficientNet-B0 (Champion model from Notebooks 04 & 05).
    Replaces model.classifier[1] with Linear(1280, n_classes).
    Retains built-in Dropout(0.2) in model.classifier[0].
    Target layer for Grad-CAM: model.features[-1]
    """
    weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.efficientnet_b0(weights=weights)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, n_classes)
    return model
