"""
Training pipeline for NeuroVision.
Supports training Baseline CNN, ResNet18, and EfficientNet-B0 with validation & checkpointing.
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from typing import Dict, Any

from ml.dataset import create_dataloaders
from ml.models import BaselineCNN, get_resnet18, get_efficientnet_b0


def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, targets in loader:
        inputs, targets = inputs.to(device), targets.to(device)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, preds = outputs.max(1)
        correct += preds.eq(targets).sum().item()
        total += targets.size(0)

    epoch_loss = running_loss / total
    epoch_acc = correct / total
    return epoch_loss, epoch_acc


def validate_epoch(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for inputs, targets in loader:
            inputs, targets = inputs.to(device), targets.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, targets)

            running_loss += loss.item() * inputs.size(0)
            _, preds = outputs.max(1)
            correct += preds.eq(targets).sum().item()
            total += targets.size(0)

    val_loss = running_loss / total
    val_acc = correct / total
    return val_loss, val_acc


def train_model(
    model_name: str = "resnet18",
    data_dir: str = "dataset/original",
    num_epochs: int = 25,
    learning_rate: float = 1e-4,
    save_path: str = "artifacts/best_model.pth"
):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Training on device: {device}")

    # Example assumes standard Training/ and Testing/ directories
    train_dir = os.path.join(data_dir, "Training")
    val_dir = os.path.join(data_dir, "Testing")

    train_loader, val_loader, _, classes = create_dataloaders(train_dir, val_dir)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open("artifacts/class_names.json", "w") as f:
        json.dump(classes, f)

    if model_name == "resnet18":
        model = get_resnet18(num_classes=len(classes), pretrained=True)
    elif model_name == "efficientnet":
        model = get_efficientnet_b0(num_classes=len(classes), pretrained=True)
    else:
        model = BaselineCNN(num_classes=len(classes))

    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    best_val_loss = float("inf")

    for epoch in range(num_epochs):
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = validate_epoch(model, val_loader, criterion, device)

        print(f"Epoch {epoch+1}/{num_epochs} - Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), save_path)
            print(f"Saved new best model to {save_path}")

    print("Training complete.")


if __name__ == "__main__":
    train_model()
