"""
NeuroVision Training Pipeline (100% aligned with Notebook 04 recipe).

Includes:
- Two-stage transfer learning (Stage 1: head-only -> Stage 2: fine-tuning)
- CrossEntropyLoss with class weighting for imbalanced tumor distributions
- AdamW optimizer + ReduceLROnPlateau scheduler
- Early stopping and checkpointing driven by validation macro-F1 score
"""

import os
import json
import time
from typing import Dict, Any, List
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import f1_score

from ml.models import build_effnet_b0, build_resnet18, BaselineCNN
from ml.dataset import create_dataloaders_from_directory


@torch.no_grad()
def evaluate_epoch(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    device: str
) -> Tuple[float, float, float]:
    """
    Evaluates loss, macro-F1, and accuracy over an entire DataLoader.
    Matches evaluate() in Notebook 04.
    """
    model.eval()
    loss_sum = 0.0
    all_targets = []
    all_preds = []

    for x, y in loader:
        x, y = x.to(device), y.to(device)
        with torch.autocast(device_type="cuda", enabled=(device == "cuda")):
            out = model(x)
            loss = criterion(out, y)
        loss_sum += loss.item() * len(y)
        all_targets.extend(y.tolist())
        all_preds.extend(out.argmax(dim=1).tolist())

    avg_loss = loss_sum / len(all_targets)
    macro_f1 = float(f1_score(all_targets, all_preds, average="macro"))
    accuracy = float(np.mean(np.array(all_targets) == np.array(all_preds)))
    return avg_loss, macro_f1, accuracy


def fit_stage(
    model: nn.Module,
    name: str,
    params,
    train_loader: DataLoader,
    val_loader: DataLoader,
    class_weights: torch.Tensor,
    device: str,
    lr: float = 1e-3,
    epochs: int = 15,
    patience: int = 5,
    weight_decay: float = 1e-4,
    freeze_bn: bool = False,
    save_dir: str = "artifacts",
    classes: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Core training loop tracking validation macro-F1.
    Saves the checkpoint whenever validation macro-F1 improves.
    """
    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = torch.optim.AdamW(params, lr=lr, weight_decay=weight_decay)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=2)
    scaler = torch.amp.GradScaler(enabled=(device == "cuda"))

    history = []
    best_f1 = -1.0
    bad_epochs = 0
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, f"{name}_best.pth")

    for ep in range(1, epochs + 1):
        t0 = time.time()
        model.train()
        train_loss, train_correct, train_total = 0.0, 0, 0

        if freeze_bn:
            for m in model.modules():
                if isinstance(m, nn.BatchNorm2d):
                    m.eval()

        for x, y in train_loader:
            x, y = x.to(device, non_blocking=True), y.to(device, non_blocking=True)
            optimizer.zero_grad(set_to_none=True)

            with torch.autocast(device_type="cuda", enabled=(device == "cuda")):
                out = model(x)
                loss = criterion(out, y)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item() * len(y)
            train_correct += (out.argmax(1) == y).sum().item()
            train_total += len(y)

        val_loss, val_f1, val_acc = evaluate_epoch(model, val_loader, criterion, device)
        scheduler.step(val_f1)

        record = {
            "epoch": ep,
            "train_loss": train_loss / train_total,
            "train_acc": train_correct / train_total,
            "val_loss": val_loss,
            "val_acc": val_acc,
            "val_macro_f1": val_f1,
            "lr": optimizer.param_groups[0]["lr"]
        }
        history.append(record)

        flag = ""
        if val_f1 > best_f1:
            best_f1 = val_f1
            bad_epochs = 0
            flag = " *saved*"
            torch.save({
                "model": model.state_dict(),
                "classes": classes,
                "val_macro_f1": val_f1,
                "epoch": ep
            }, save_path)
        else:
            bad_epochs += 1

        print(f"Epoch {ep:02d} | Train Loss {record['train_loss']:.4f} Acc {record['train_acc']:.3f} | "
              f"Val Loss {val_loss:.4f} Acc {val_acc:.3f} F1 {val_f1:.3f} | {time.time()-t0:.0f}s{flag}")

        if bad_epochs >= patience:
            print(f"Early stopping triggered after {patience} epochs without validation macro-F1 improvement.")
            break

    return history
