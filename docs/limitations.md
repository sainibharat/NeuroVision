# Project Limitations & Clinical Disclaimer

## Research Prototype Disclaimer
NeuroVision is designed strictly as an **educational and engineering research prototype**. It is **not** a certified medical diagnostic device or software. It must not be used for clinical decision-making or diagnosis.

## Known Technical Limitations
1. **Dataset Bias & Slice Selection**:
   - MRI datasets from public repositories often contain pre-selected 2D slices showing distinct pathologies rather than raw full 3D volumetric DICOM sequences (T1, T1ce, T2, FLAIR).
2. **Patient-Level Separation**:
   - Unless patient IDs are explicitly provided in metadata, multiple slices from the same patient could potentially be present, risking subtle data leakage across splits.
3. **Grad-CAM Resolution**:
   - Grad-CAM highlights coarse localization regions derived from low-resolution feature maps (e.g. 7x7 in ResNet18) and should not be confused with pixel-level lesion segmentation (such as U-Net or nnU-Net).
4. **Out-of-Distribution Inputs**:
   - Non-brain images or non-MRI scans will still produce an output; out-of-distribution detection checks should be incorporated in production setups.
