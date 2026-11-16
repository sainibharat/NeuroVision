# Methodology & Modeling Strategy

## 1. Problem Formulation
NeuroVision performs a 4-class multi-class image classification task:
- Input: Brain MRI scan (axial / coronal / sagittal slice)
- Preprocessing: Grayscale to 3-channel RGB conversion, resizing to 224x224 pixels, normalization using ImageNet statistics.
- Output: Softmax probability distribution over 4 classes + Grad-CAM heatmap visualization.

## 2. Experimental Stages (Notebooks 01 - 06)
1. **01_dataset_exploration.ipynb**: Distribution analysis, corrupted image checks, dimension histograms.
2. **02_preprocessing.ipynb**: Resizing, normalization, data augmentation (subtle rotations, horizontal flip, brightness adjustment).
3. **03_baseline_cnn.ipynb**: Simple custom multi-layer CNN to benchmark performance from scratch.
4. **04_resnet18_training.ipynb**: Transfer learning with ResNet18 pretrained on ImageNet; frozen feature extractor followed by fine-tuning.
5. **05_model_comparison.ipynb**: Comparison of Baseline CNN, ResNet18, and EfficientNet-B0 across Accuracy, F1-Score, and inference latency.
6. **06_gradcam.ipynb**: Implementation of Gradient-weighted Class Activation Mapping (Grad-CAM) targeting the final convolutional layer (e.g. `layer4` in ResNet18).

## 3. Explainability (Grad-CAM)
Grad-CAM calculates the gradient of the score for target class \(c\) with respect to feature activation map \(A^k\) of a convolutional layer:
$$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A_{i,j}^k}$$
The weighted combination is passed through a ReLU to obtain positive evidence for class \(c\):
$$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$
The heatmap is bilinearly upsampled to 224x224 and blended over the original MRI scan.
