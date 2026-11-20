"""
End-to-End AI/ML Pipeline Verification Script.
Validates:
1. Model architecture instantiation & state_dict weights loading from artifacts/best_model.pth
2. Class mapping consistency from artifacts/class_names.json
3. Image preprocessing & tensor conversion (224x224, ImageNet norm)
4. Forward pass & softmax probability distribution
5. Grad-CAM backward pass, gradient pooling, ReLU, and overlay generation
6. NeuroVisionPredictor high-level API execution
"""

import os
import sys
import json
import time
from PIL import Image, ImageDraw

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import torch
from ml.models import build_model
from ml.explain import GradCAM, preprocess, heatmap_image, overlay
from ml.predict import NeuroVisionPredictor


def create_synthetic_mri() -> Image.Image:
    """Creates a synthetic brain MRI slice for verification without external assets."""
    img = Image.new("RGB", (256, 256), color=(10, 12, 16))
    draw = ImageDraw.Draw(img)
    # Skull boundary
    draw.ellipse([30, 20, 226, 236], fill=(40, 45, 52), outline=(70, 75, 85), width=3)
    # Brain parenchyma
    draw.ellipse([45, 35, 211, 221], fill=(55, 60, 68))
    # Ventricles
    draw.ellipse([105, 100, 120, 140], fill=(20, 22, 28))
    draw.ellipse([136, 100, 151, 140], fill=(20, 22, 28))
    # Synthetic hyperintense lesion (simulating tumor mass in right frontal lobe)
    draw.ellipse([145, 65, 185, 105], fill=(210, 215, 225), outline=(240, 245, 255), width=2)
    return img


def run_checks():
    print("=" * 70, flush=True)
    print(" NeuroVision AI/ML Pipeline Cross-Check", flush=True)
    print("=" * 70, flush=True)

    # 1. Classes verification
    class_file = os.path.join(PROJECT_ROOT, "artifacts", "class_names.json")
    assert os.path.exists(class_file), f"Missing {class_file}"
    with open(class_file, "r") as f:
        classes = json.load(f)
    print(f"[1/6] Class names verified: {classes} (Count: {len(classes)})", flush=True)
    assert classes == ["glioma", "meningioma", "no_tumor", "pituitary"], f"Unexpected classes: {classes}"

    # 2. Checkpoint weights verification
    weights_path = os.path.join(PROJECT_ROOT, "artifacts", "best_model.pth")
    assert os.path.exists(weights_path), f"Missing checkpoint: {weights_path}"
    file_size_mb = os.path.getsize(weights_path) / (1024 * 1024)
    print(f"[2/6] Found checkpoint: {weights_path} ({file_size_mb:.2f} MB)", flush=True)

    # 3. Model construction and loading
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[3/6] Device selected: {device.upper()}", flush=True)
    model = build_model(n_classes=len(classes))
    
    # Safe load with weights_only=False for checkpoints containing classes/epochs metadata
    checkpoint = torch.load(weights_path, map_location=device, weights_only=False)

    if isinstance(checkpoint, dict) and "model" in checkpoint:
        state_dict = checkpoint["model"]
        epoch = checkpoint.get("epoch", "unknown")
        val_f1 = checkpoint.get("val_macro_f1", "unknown")
        print(f"      Checkpoint metadata -> Epoch: {epoch}, Val Macro-F1: {val_f1}", flush=True)
    elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
        state_dict = checkpoint["state_dict"]
    else:
        state_dict = checkpoint

    load_result = model.load_state_dict(state_dict, strict=True)
    model.to(device).eval()
    print(f"      Loaded state_dict strictly: {load_result}", flush=True)

    # 4. Preprocessing check
    test_img = create_synthetic_mri()
    x = preprocess(test_img).to(device)
    print(f"[4/6] Preprocessing check:", flush=True)
    print(f"      Input image size: {test_img.size} -> Tensor shape: {list(x.shape)}", flush=True)
    assert x.shape == (1, 3, 224, 224), f"Expected (1, 3, 224, 224), got {x.shape}"
    assert x.dtype == torch.float32, f"Expected float32, got {x.dtype}"

    # 5. Inference & Grad-CAM verification
    target_layer = model.features[-1]
    gradcam = GradCAM(model, target_layer)

    t0 = time.time()
    cam, probs, pred_idx = gradcam(x)
    infer_time = (time.time() - t0) * 1000

    pred_class = classes[pred_idx]
    confidence = float(probs[pred_idx])

    print(f"[5/6] Inference & Grad-CAM execution ({infer_time:.1f} ms):", flush=True)
    print(f"      Predicted Class: {pred_class} (Index: {pred_idx})", flush=True)
    print(f"      Confidence:      {confidence * 100:.2f}%", flush=True)
    print(f"      All Probabilities:", flush=True)
    for c, p in zip(classes, probs):
        bar = "█" * int(p * 30)
        print(f"        • {c:<12}: {p * 100:5.2f}% {bar}", flush=True)

    assert cam.shape == (224, 224), f"CAM shape should be (224, 224), got {cam.shape}"
    assert 0.0 <= cam.min() and cam.max() <= 1.0, "CAM values not normalized to [0, 1]"
    assert cam.max() > 0.0, "CAM has zero activation"
    print(f"      Grad-CAM heatmap shape: {cam.shape}, min: {cam.min():.4f}, max: {cam.max():.4f}", flush=True)

    # Visual overlay test
    over = overlay(test_img, cam, alpha=0.45)
    assert over.size == (224, 224), f"Overlay size mismatch: {over.size}"
    output_preview = os.path.join(PROJECT_ROOT, "artifacts", "test_gradcam_verification.png")
    over.save(output_preview)
    print(f"      Saved verification overlay to: {output_preview}", flush=True)

    # 6. NeuroVisionPredictor high-level API check
    predictor = NeuroVisionPredictor(model_path=weights_path, class_names_path=class_file, device=device)
    api_result = predictor.predict(test_img, generate_explanation=True)
    assert api_result["predicted_class"] == pred_class
    assert "overlay_base64" in api_result and len(api_result["overlay_base64"]) > 100
    print(f"[6/6] NeuroVisionPredictor high-level API check: PASSED", flush=True)
    print(f"      Base64 overlay generated (Length: {len(api_result['overlay_base64'])} chars)", flush=True)

    print("=" * 70, flush=True)
    print(" ALL PIPELINES VERIFIED SUCCESSFULLY!", flush=True)
    print("=" * 70, flush=True)


if __name__ == "__main__":
    run_checks()
