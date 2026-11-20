"""
NeuroVision Model Architectures (Notebooks 02, 03, 04, 05, 06).

Champion Model:
- EfficientNet-B0 adapted for 4-class Brain MRI classification.
"""

import torch
import torch.nn as nn
from torchvision import models


def build_model(n_classes: int = 4) -> nn.Module:
    """
    EfficientNet-B0 with a 4-class head. Same architecture as notebooks 04-06.
    weights=None: the trained weights come from artifacts/best_model.pth.
    """
    m = models.efficientnet_b0(weights=None)
    m.classifier[1] = nn.Linear(m.classifier[1].in_features, n_classes)
    return m


def build_effnet_b0(n_classes: int = 4, pretrained: bool = False) -> nn.Module:
    """Alias for build_model."""
    weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
    m = models.efficientnet_b0(weights=weights)
    m.classifier[1] = nn.Linear(m.classifier[1].in_features, n_classes)
    return m


def build_resnet18(n_classes: int = 4, pretrained: bool = False) -> nn.Module:
    """ResNet-18 comparison model from Notebook 03."""
    weights = models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
    m = models.resnet18(weights=weights)
    m.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(m.fc.in_features, n_classes)
    )
    return m


def conv_block(in_channels: int, out_channels: int) -> nn.Sequential:
    """Double-conv block with BatchNorm and MaxPool from Notebook 02."""
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
    """Custom 4-block CNN baseline from Notebook 02."""
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
