# Dataset Guide: NeuroVision

## Overview
NeuroVision uses a standardized 4-class Brain MRI dataset:
- **Glioma** (2,191 scans total)
- **Meningioma** (1,478 scans total)
- **Pituitary Tumor** (1,485 scans total)
- **No Tumor** (787 scans total)
- **Total**: 5,941 MRI scans

## Data Source
- **Kaggle Dataset**: `sainibharat10/neurovision-brain-mri`
- Download command (using `kagglehub`):
  ```python
  import kagglehub
  path = kagglehub.dataset_download("sainibharat10/neurovision-brain-mri")
  ```

## Folder Organization
The dataset is split into `train` (70%), `val` (15%), and `test` (15%):
```
dataset/original/
├── train/          # 4,160 scans
│   ├── glioma/     # 1,534
│   ├── meningioma/ # 1,035
│   ├── no_tumor/   # 551
│   └── pituitary/  # 1,040
├── val/            # 892 scans
│   ├── glioma/     # 329
│   ├── meningioma/ # 222
│   ├── no_tumor/   # 118
│   └── pituitary/  # 223
└── test/           # 889 scans (held-out for final reporting)
    ├── glioma/     # 328
    ├── meningioma/ # 221
    ├── no_tumor/   # 118
    └── pituitary/  # 222
```

## Preprocessing Requirements
- **Resolution**: Resized to 224 × 224 pixels (Bilinear interpolation)
- **Color channels**: RGB (3 channels)
- **Normalization**: Standard ImageNet statistics
  - Mean: `[0.485, 0.456, 0.406]`
  - Standard Deviation: `[0.229, 0.224, 0.225]`
- **Training Augmentations**:
  - `RandomRotation(degrees=10)`
  - `RandomAffine(degrees=0, translate=(0.05, 0.05))`
  - `ColorJitter(brightness=0.1, contrast=0.1)`
