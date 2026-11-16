"""
NeuroVision Model Evaluation & Error Analysis (100% aligned with Notebook 05).

Computes:
- Overall test accuracy, macro-F1, and balanced accuracy
- Tumor sensitivity (pooled across all 3 tumor types)
- Normal tissue specificity (no_tumor true negative rate)
- Per-class precision, recall, F1-score, and support
- Full confusion matrix
"""

from typing import Dict, Any, List
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    balanced_accuracy_score,
    precision_recall_fscore_support
)


@torch.no_grad()
def evaluate_test_set(
    model: nn.Module,
    dataloader: DataLoader,
    class_names: List[str],
    device: str
) -> Dict[str, Any]:
    """
    Runs a single comprehensive evaluation pass over the held-out test set.
    Directly produces the metrics stored in artifacts/metrics.json.
    """
    model.eval()
    all_targets = []
    all_preds = []
    all_probs = []

    for x, y in dataloader:
        x = x.to(device)
        logits = model(x)
        probs = torch.softmax(logits, dim=1).cpu().numpy()
        preds = np.argmax(probs, axis=1)

        all_targets.extend(y.numpy())
        all_preds.extend(preds)
        all_probs.extend(probs)

    y_true = np.array(all_targets)
    y_pred = np.array(all_preds)

    total_samples = len(y_true)
    correct_samples = int(np.sum(y_true == y_pred))
    errors = total_samples - correct_samples

    acc = float(np.mean(y_true == y_pred))
    macro_f1 = float(f1_score(y_true, y_pred, average="macro"))
    bal_acc = float(balanced_accuracy_score(y_true, y_pred))

    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    cm = confusion_matrix(y_true, y_pred).tolist()

    # Clinical sensitivity and specificity
    # Healthy class is "no_tumor"
    no_tumor_idx = class_names.index("no_tumor") if "no_tumor" in class_names else -1

    tumor_sensitivity = None
    no_tumor_specificity = None

    if no_tumor_idx >= 0:
        tumor_mask = y_true != no_tumor_idx
        tumor_sensitivity = float(np.mean(y_pred[tumor_mask] != no_tumor_idx))

        healthy_mask = y_true == no_tumor_idx
        no_tumor_specificity = float(np.mean(y_pred[healthy_mask] == no_tumor_idx))

    return {
        "n_test": total_samples,
        "correct": correct_samples,
        "errors": errors,
        "accuracy": acc,
        "macro_f1": macro_f1,
        "balanced_accuracy": bal_acc,
        "tumor_sensitivity": tumor_sensitivity,
        "no_tumor_specificity": no_tumor_specificity,
        "confusion_matrix": cm,
        "classification_report": report
    }
