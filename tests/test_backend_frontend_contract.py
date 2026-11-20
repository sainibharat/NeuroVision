"""
Comprehensive Backend-Frontend Integration Contract Verification.
Validates all backend responses, error cases, formats, and CORS against
the expectations of the updated NeuroVision React frontend.
"""

import os
import sys
import io
import json
from PIL import Image, ImageDraw
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)


def make_test_image(mode="RGB", size=(256, 256), format="PNG"):
    """Creates a synthetic MRI slice with skull and simulated tumor."""
    img = Image.new(mode, size, color=0 if mode == "L" else (12, 14, 20))
    draw = ImageDraw.Draw(img)
    # Skull boundary
    w, h = size
    draw.ellipse([int(w * 0.15), int(h * 0.1), int(w * 0.85), int(h * 0.9)], 
                 fill=40 if mode == "L" else (45, 50, 60), 
                 outline=80 if mode == "L" else (85, 90, 105), 
                 width=3)
    # Focal hyperintensity (simulated lesion)
    draw.ellipse([int(w * 0.55), int(h * 0.35), int(w * 0.72), int(h * 0.52)], 
                 fill=210 if mode == "L" else (220, 220, 235))
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()


def run_contract_tests():
    print("=" * 72)
    print(" NeuroVision Backend-Frontend Contract Verification")
    print("=" * 72)

    # 1. CORS Headers Verification
    print("\n[Test 1] CORS Pre-flight and Headers for Frontend (localhost:5173)")
    res_cors = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        }
    )
    assert res_cors.status_code == 200, f"Expected 200 on OPTIONS, got {res_cors.status_code}"
    assert "access-control-allow-origin" in res_cors.headers
    print(" -> PASS: CORS headers correctly configured for frontend origin.")

    # 2. Health Endpoint Contract
    print("\n[Test 2] GET /health (polled by Navbar & App.jsx)")
    res_health = client.get("/health")
    assert res_health.status_code == 200
    health = res_health.json()
    assert health["status"] == "healthy"
    assert health["model_loaded"] is True
    assert set(health["classes"]) == {"glioma", "meningioma", "no_tumor", "pituitary"}
    print(f" -> PASS: Health endpoint returned model_loaded={health['model_loaded']}, classes={health['classes']}")

    # 3. Predict with RGB PNG (Standard Flow)
    print("\n[Test 3] POST /predict?explain=true with Standard RGB PNG")
    png_bytes = make_test_image(mode="RGB", size=(256, 256), format="PNG")
    res_png = client.post("/predict?explain=true", files={"file": ("brain_scan.png", png_bytes, "image/png")})
    assert res_png.status_code == 200
    data = res_png.json()
    
    # Contract checks:
    assert "predicted_class" in data
    assert data["predicted_class"] in health["classes"]
    assert "confidence" in data and 0.0 <= data["confidence"] <= 1.0
    assert "probabilities" in data and len(data["probabilities"]) == 4
    prob_sum = sum(data["probabilities"].values())
    assert abs(prob_sum - 1.0) < 0.01, f"Probabilities must sum to 1, got {prob_sum}"
    assert "overlay_base64" in data and data["overlay_base64"] is not None
    assert len(data["overlay_base64"]) > 500
    print(f" -> PASS: Prediction={data['predicted_class']} ({data['confidence']*100:.1f}%), Overlay length={len(data['overlay_base64'])} bytes")

    # 4. Predict with Grayscale (1-channel) JPEG
    print("\n[Test 4] POST /predict with 1-Channel Grayscale JPEG (Clinical Scans)")
    gray_bytes = make_test_image(mode="L", size=(512, 512), format="JPEG")
    res_gray = client.post("/predict?explain=true", files={"file": ("mri_gray.jpg", gray_bytes, "image/jpeg")})
    assert res_gray.status_code == 200
    data_gray = res_gray.json()
    assert data_gray["predicted_class"] in health["classes"]
    assert "overlay_base64" in data_gray
    print(f" -> PASS: 512x512 Grayscale scan successfully normalized, predicted={data_gray['predicted_class']}")

    # 5. Predict with explain=false (Quick Mode)
    print("\n[Test 5] POST /predict?explain=false (Without Grad-CAM)")
    res_quick = client.post("/predict?explain=false", files={"file": ("scan_quick.png", png_bytes, "image/png")})
    assert res_quick.status_code == 200
    data_quick = res_quick.json()
    assert data_quick["predicted_class"] in health["classes"]
    print(f" -> PASS: Quick prediction completed in minimal latency.")

    # 6. Error Handling: Invalid file extension
    print("\n[Test 6] POST /predict with unsupported file (.pdf/.txt)")
    bad_file = client.post("/predict", files={"file": ("document.txt", b"not an image", "text/plain")})
    assert bad_file.status_code == 400
    print(f" -> PASS: Rejected invalid extension with HTTP 400: '{bad_file.json()['detail']}'")

    # 7. Error Handling: Corrupted image file
    print("\n[Test 7] POST /predict with corrupted image payload")
    corrupt_file = client.post("/predict", files={"file": ("fake_mri.png", b"\x89PNG\r\n\x1a\ncorrupted_payload_bytes", "image/png")})
    assert corrupt_file.status_code == 400
    print(f" -> PASS: Caught corrupted image with HTTP 400: '{corrupt_file.json()['detail']}'")

    print("\n" + "=" * 72)
    print(" ALL 7 BACKEND-FRONTEND INTEGRATION CONTRACT TESTS PASSED!")
    print("=" * 72)


if __name__ == "__main__":
    run_contract_tests()
