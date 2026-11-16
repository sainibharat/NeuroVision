# Experimental Results & Model Benchmarks

## 1. Final Model Performance on Held-Out Test Set (Notebook 05)

- **Selected Model Architecture**: EfficientNet-B0 (Pretrained on ImageNet, fine-tuned on Brain MRI)
- **Checkpoint Epoch**: 21
- **Total Test Samples**: 889
- **Overall Test Accuracy**: **98.31%** (874 / 889 correct, only 15 errors)
- **Macro-Averaged F1-Score**: **0.9826**
- **Balanced Accuracy**: **0.9829**

### Per-Class Test Breakdown

| Class | Precision | Recall | F1-Score | Support (Test Images) |
|---|---|---|---|---|
| **Glioma** | 0.982 | 0.985 | 0.983 | 328 |
| **Meningioma** | 0.982 | 0.968 | 0.975 | 221 |
| **No Tumor** | 0.975 | 0.983 | 0.979 | 118 |
| **Pituitary** | 0.991 | 0.995 | 0.993 | 222 |
| **Macro Average** | **0.982** | **0.983** | **0.983** | **889** |

---

## 2. Model Selection Rationale (Notebooks 03 & 04)
- **Baseline CNN**: Provided an initial baseline with simple 4-block architecture.
- **ResNet-18**: Strong convergence and feature extraction from ImageNet pretraining.
- **EfficientNet-B0**: Selected as the final production model due to superior macro-F1 (0.983), compact parameter footprint (~4.0M parameters), and excellent Grad-CAM localization on `model.features[-1]`.
