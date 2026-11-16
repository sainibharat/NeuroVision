# Dataset Guide: NeuroVision

## Overview
NeuroVision uses a 4-class Brain MRI dataset:
- **Glioma**
- **Meningioma**
- **Pituitary Tumor**
- **No Tumor**

## Data Source
- Kaggle: Brain Tumor MRI Dataset (e.g., Sartaj Bhuvaji / Masoud Nickparvar dataset)
- Place raw downloaded data in `dataset/original/`.

## Folder Organization
```
dataset/original/
├── Training/
│   ├── glioma/
│   ├── meningioma/
│   ├── notumor/
│   └── pituitary/
└── Testing/
    ├── glioma/
    ├── meningioma/
    ├── notumor/
    └── pituitary/
```
*(or single combined directory partitioned via train/val/test splits)*

## Preprocessing Requirements
- Resolution: Resized to 224x224
- Normalization: ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- Color channels: RGB (3 channels)
