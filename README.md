# 🧠 NeuroVision: Explainable AI for Brain Tumor Detection from MRI Scans

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%20%7C%203.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch 2.2+](https://img.shields.io/badge/PyTorch-2.2+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Test Accuracy](https://img.shields.io/badge/Test%20Accuracy-98.31%25-brightgreen)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **NeuroVision** is an end-to-end Explainable Deep Learning platform designed to classify Brain MRI scans across four distinct pathological categories and provide clinical practitioners with transparent, spatial visual attention localization via **Grad-CAM (Gradient-Weighted Class Activation Mapping)**.

---

## 🌟 Key Highlights

- **Champion Architecture**: Fine-tuned **EfficientNet-B0** transfer learning model (~4.01M parameters) achieving **98.31% test accuracy** and **0.9826 Macro-F1** across 889 held-out test scans.
- **High Clinical Sensitivity**: **99.61% tumor detection sensitivity** (768 of 771 pathological tumor scans correctly flagged).
- **Explainable AI (XAI)**: Visualizes convolutional gradient activations on `model.features[-1]` overlaid directly on the axial MRI scan via a Jet colormap.
- **Full-Stack SaaS Interface**: React + Tailwind CSS dashboard with responsive drag-and-drop, interactive side-by-side heatmap viewer, and 1-click **Download Diagnostic Report** (HTML/PDF).
- **Production Backend**: Asynchronous FastAPI service with singleton model caching, file validation, robust error handling, and CORS middleware.

---

## 📊 Benchmark Evaluation (Held-Out Test Set: $n = 889$)

Evaluated strictly on held-out scans across four classes: **Glioma ($n=328$)**, **Meningioma ($n=221$)**, **Pituitary ($n=222$)**, and **No Tumor Control ($n=118$)**.

| Architecture | Strategy | Parameters | Validation Acc | Test Acc (889 Scans) | Macro F1 | Clinical Role |
|---|---|---|---|---|---|---|
| **Baseline CNN** | Custom 4-Block ConvNet | ~1.17M | 92.04% | 91.45% | 0.9120 | Baseline Reference |
| **ResNet-18** | Transfer Learning (ImageNet) | 11.18M | 96.64% | 96.18% | 0.9610 | Comparative Backbone |
| **EfficientNet-B0** 🏆 | Transfer Learning (Fine-Tuned) | **4.01M** | **98.43%** | **98.31%** | **0.9826** | **Production Champion** |

### Test Confusion Matrix (EfficientNet-B0)
```
                  PREDICTED
              Glioma  Meningioma  No_Tumor  Pituitary   Total
Glioma           323          4         1          0     328
Meningioma         5        214         1          1     221
No Tumor           1          0       116          1     118
Pituitary          0          0         1        221     222
Total            329        218       119        223     889
```
*Total Errors: Only 15 out of 889 scans (1.69% error rate).*

---

## 🏗️ System Architecture

```
User Browser (React + Tailwind CSS)
       │
       ▼ (multipart/form-data)
FastAPI Server (backend/main.py :8000)
       │
       ▼ (Singleton Manager)
NeuroVisionPredictor (ml/predict.py)
       │
       ├──► ml/models.py  ───► EfficientNet-B0 (artifacts/best_model.pth)
       │
       └──► ml/explain.py ───► Grad-CAM on model.features[-1]
                                 ├── Bilinear Upsampling
                                 ├── Jet Colormap Heatmap
                                 └── Base64 Stream Encoding
       │
       ▼ (JSON Response)
{
  "predicted_class": "glioma",
  "confidence": 0.982,
  "probabilities": {"glioma": 0.982, "meningioma": 0.008, ...},
  "overlay_base64": "data:image/png;base64,..."
}
```

---

## 📁 Repository Structure

```
NeuroVision/
├── artifacts/
│   ├── best_model.pth             # Champion PyTorch weights (15.59 MB)
│   ├── class_names.json           # Target class mapping (4 categories)
│   └── metrics.json               # Full test split metrics & confusion matrix
├── backend/
│   ├── main.py                    # FastAPI application & route definitions
│   ├── inference.py               # Singleton model orchestrator
│   ├── schemas.py                 # Pydantic validation models
│   └── requirements.txt           # Production Python dependencies
├── dataset/
│   └── README.md                  # Dataset provenance (sainibharat10/neurovision-brain-mri)
├── docs/
│   ├── methodology.md             # Clinical rationale & transfer learning
│   ├── results.md                 # Quantitative evaluation report
│   ├── limitations.md             # Medical limitations & scanner variance
│   ├── test_confusion_matrix.png  # Confusion matrix plot
│   ├── test_errors.png            # Visual error breakdown
│   ├── test_errors.csv            # Tabular breakdown of 15 test misclassifications
│   ├── gradcam_examples.png       # True-positive Grad-CAM visual proofs
│   ├── gradcam_errors.png         # False-negative Grad-CAM visual analysis
│   └── gradcam_sanity.json        # Adebayo randomization sanity checks
├── frontend/                      # React 18 + Tailwind CSS Dashboard
│   ├── public/
│   │   └── hero-bg-clean.jpg      # High-end 3D neural brain background
│   ├── src/
│   │   ├── components/            # Dropzone, HeatmapViewer, ProbabilityBar
│   │   ├── components/ui/         # DRY Design System (Button, Card, Badge)
│   │   ├── pages/                 # Home, Classifier, Results, ModelInfo
│   │   ├── services/api.js        # Backend HTTP client
│   │   └── utils/reportGenerator.js # HTML/PDF Clinical Report Generator
│   ├── package.json
│   └── tailwind.config.js
├── ml/                            # PyTorch Machine Learning Engine
│   ├── __init__.py                # Package gateway & public exports
│   ├── models.py                  # Neural network architectures
│   ├── dataset.py                 # Data transforms & PyTorch DataLoaders
│   ├── train.py                   # Two-stage AdamW training pipeline
│   ├── evaluate.py                # Quantitative evaluation metrics
│   ├── explain.py                 # Grad-CAM hooks & visualization
│   └── predict.py                 # Production inference interface
├── notebooks/                     # Exploratory Data Science & Training Notebooks
│   ├── 01_dataset_exploration.ipynb
│   ├── 02_baseline_cnn.ipynb
│   ├── 03_resnet18_transfer.ipynb
│   ├── 04_efficientnet_b0.ipynb
│   ├── 05_final_test_evaluation.ipynb
│   └── 06_gradcam.ipynb
├── tests/
│   ├── test_model.py              # Architecture unit tests (4-class forward pass)
│   ├── test_preprocessing.py      # Transform & normalization unit tests
│   ├── test_api.py                # Server smoke test (FastAPI TestClient)
│   ├── test_ml_pipeline.py        # ML pipeline integration & Grad-CAM check
│   ├── test_api_endpoints.py      # Starlette backend endpoint tests
│   └── test_backend_frontend_contract.py # End-to-end API contract tests
├── Dockerfile                     # Production containerization
├── .gitignore
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Clone & Set Up Backend

```powershell
# Clone the repository
git clone https://github.com/<your-username>/NeuroVision.git
cd NeuroVision

# Create and activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate       # On Windows
# source .venv/bin/activate    # On Linux/macOS

# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --reload --port 8000
```
> The API will be active at `http://localhost:8000` (Interactive docs at `http://localhost:8000/docs`).

### 2. Set Up & Run Frontend

```powershell
# In a new terminal:
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
> Open `http://localhost:5173` to launch the NeuroVision dashboard.

---

## 🐳 Docker Deployment (1-Click Run)

To build and run the production container:

```bash
# Build the container
docker build -t neurovision-api .

# Run the API container on port 8000
docker run -p 8000:8000 neurovision-api
```

---

## 🧪 Running Automated Tests

Run the test suites to verify ML pipelines, endpoints, and CORS contracts:

```powershell
# 1. Verify ML Inference & Grad-CAM pipeline
python tests/test_ml_pipeline.py

# 2. Verify FastAPI Endpoints
python tests/test_api_endpoints.py

# 3. Verify End-to-End Backend-Frontend Contract (CORS, file formats, errors)
python tests/test_backend_frontend_contract.py
```

---

## ⚖️ Clinical Disclaimer

NeuroVision is developed strictly as a research and educational technical portfolio system. It is **not** an FDA-cleared diagnostic medical device and must not be used as a standalone tool for clinical patient diagnosis or surgical planning. Final clinical determinations must always be made by a certified neuro-radiologist or physician.

---

## 📜 License

Distributed under the [MIT Educational & Non-Commercial License](LICENSE). Strictly for academic and educational research purposes only (Not for sale or commercial distribution).
