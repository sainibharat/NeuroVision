"""
Evaluation metrics and error analysis for NeuroVision.
Computes accuracy, macro precision, recall, F1, and confusion matrix.
"""

from typing import Dict, Any, List
import torch
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score


def evaluate_model(
    model: torch.nn.Module,
    dataloader: torch.utils.data.DataLoader,
    device: str,
    class_names: List[str]
) -> Dict[str, Any]:
    """
    Evaluates model across a test or validation dataloader.
    """
    model.eval()
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, targets in dataloader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            preds = torch.argmax(outputs, dim=1).cpu().numpy()

            all_preds.extend(preds)
            all_targets.extend(targets.numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    acc = accuracy_score(all_targets, all_preds)
    report = classification_report(all_targets, all_preds, target_names=class_names, output_dict=True)
    cm = confusion_matrix(all_targets, all_preds).tolist()

    return {
        "accuracy": float(acc),
        "macro_precision": float(report["macro avg"]["precision"]),
        "macro_recall": float(report["macro avg"]["recall"]),
        "macro_f1": float(report["macro avg"]["f1-score"]),
        "classification_report": report,
        "confusion_matrix": cm
    }
