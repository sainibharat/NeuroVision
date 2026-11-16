# NeuroVision: Explainable Deep Learning for Brain Tumor Classification from MRI Images

NeuroVision is an end-to-end deep learning system that classifies brain MRI scans into four categories and provides visual explanations of its predictions using Grad-CAM heatmaps.

---

## 🎯 Key Objectives
- **Accurate Classification**: Distinguish between Glioma, Meningioma, Pituitary tumor, and No Tumor.
- **Explainability (XAI)**: Visualize salient regions using **Grad-CAM** (Gradient-weighted Class Activation Mapping) overlaid on original MRI scans.
- **Production Architecture**: A modular FastAPI backend paired with an intuitive React + Vite frontend.

---

## 🏗️ System Architecture
```
MRI Image (Upload)
       ↓
Preprocessing (Resize 224x224, Normalization)
       ↓
Trained Deep Learning Model (ResNet18 / EfficientNet-B0)
       ↓
┌──────────────────────┴──────────────────────┐
↓                                             ↓
Tumor Classification & Probabilities        Grad-CAM Heatmap Generation
└──────────────────────┬──────────────────────┘
                       ↓
FastAPI Backend (REST API)
                       ↓
React + Vite Interactive Frontend Dashboard
```

---

## 📁 Repository Structure
```
NeuroVision/
├── dataset/
│   ├── original/              # Raw MRI scan images (gitignored)
│   └── README.md              # Dataset provenance, license & guidelines
├── notebooks/                 # Experimental Colab / Jupyter notebooks
│   ├── 01_dataset_exploration.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_baseline_cnn.ipynb
│   ├── 04_resnet18_training.ipynb
│   ├── 05_model_comparison.ipynb
│   └── 06_gradcam.ipynb
├── ml/                        # Production modular ML pipeline
│   ├── dataset.py             # Dataset loading & PyTorch DataLoaders
│   ├── models.py              # CNN, ResNet18 & EfficientNet architectures
│   ├── train.py               # Training loop with early stopping & checkpoints
│   ├── evaluate.py            # Confusion matrix, classification reports
│   ├── predict.py             # Model inference engine
│   └── explain.py             # Grad-CAM heatmap extraction
├── artifacts/                 # Saved weights and runtime configuration
│   ├── best_model.pth         # PyTorch model weights
│   ├── class_names.json       # Target class indices to label map
│   └── metrics.json           # Evaluation metrics on test partition
├── backend/                   # FastAPI application
│   ├── main.py                # API router & middleware
│   ├── schemas.py             # Pydantic request/response schemas
│   ├── inference.py           # Model loading & orchestration
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React + Vite web dashboard
│   ├── src/
│   │   ├── components/        # Reusable UI widgets (dropzone, heatmaps, badges)
│   │   ├── pages/             # Home, Classifier, Model Info
│   │   ├── services/          # API client for backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
├── tests/                     # Unit and integration tests
│   ├── test_preprocessing.py
│   ├── test_model.py
│   └── test_api.py
├── docs/                      # Technical documentation
│   ├── methodology.md
│   ├── results.md
│   └── limitations.md
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔬 Classification Targets
1. **Glioma**
2. **Meningioma**
3. **Pituitary Tumor**
4. **No Tumor**

> **Disclaimer**: *NeuroVision is an educational and research prototype, not a clinically validated diagnostic device. Model confidence does not equate to clinical diagnosis.*
