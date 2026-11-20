"""
FastAPI Endpoints Verification Test.
Tests GET /, GET /health, GET /metrics, and POST /predict using starlette.testclient.
"""

import os
import sys
import io
from PIL import Image, ImageDraw

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)


def create_test_image_bytes() -> bytes:
    img = Image.new("RGB", (224, 224), color=(15, 18, 24))
    draw = ImageDraw.Draw(img)
    draw.ellipse([40, 30, 184, 194], fill=(50, 55, 65), outline=(90, 95, 110), width=2)
    draw.ellipse([120, 70, 160, 110], fill=(220, 225, 235))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def run_api_tests():
    print("=" * 70, flush=True)
    print(" NeuroVision Backend API Verification Tests", flush=True)
    print("=" * 70, flush=True)

    # 1. Root
    res_root = client.get("/")
    print(f"[1/4] GET / -> Status {res_root.status_code}", flush=True)
    assert res_root.status_code == 200
    assert "endpoints" in res_root.json()

    # 2. Health
    res_health = client.get("/health")
    print(f"[2/4] GET /health -> Status {res_health.status_code}", flush=True)
    assert res_health.status_code == 200
    health_data = res_health.json()
    print(f"      Model loaded: {health_data['model_loaded']}, Model type: {health_data['model_type']}", flush=True)
    print(f"      Classes: {health_data['classes']}", flush=True)
    assert health_data["model_loaded"] is True
    assert health_data["classes"] == ["glioma", "meningioma", "no_tumor", "pituitary"]

    # 3. Metrics
    res_metrics = client.get("/metrics")
    print(f"[3/4] GET /metrics -> Status {res_metrics.status_code}", flush=True)
    assert res_metrics.status_code == 200
    metrics_data = res_metrics.json()
    test_acc = metrics_data.get("test", {}).get("accuracy")
    print(f"      Test accuracy in metrics.json: {test_acc * 100:.2f}%", flush=True)
    assert round(test_acc, 2) == 0.98

    # 4. Predict
    img_bytes = create_test_image_bytes()
    files = {"file": ("test_mri.png", img_bytes, "image/png")}
    res_predict = client.post("/predict?explain=true", files=files)
    print(f"[4/4] POST /predict -> Status {res_predict.status_code}", flush=True)
    assert res_predict.status_code == 200
    pred_data = res_predict.json()
    print(f"      Predicted Class: {pred_data['predicted_class']}", flush=True)
    print(f"      Confidence:      {pred_data['confidence'] * 100:.2f}%", flush=True)
    print(f"      Probabilities:   {pred_data['probabilities']}", flush=True)
    print(f"      Overlay Base64:  Available (Length: {len(pred_data['overlay_base64'])})", flush=True)
    assert pred_data["explanation_available"] is True
    assert "overlay_base64" in pred_data and len(pred_data["overlay_base64"]) > 100

    print("=" * 70, flush=True)
    print(" ALL BACKEND API TESTS PASSED SUCCESSFULLY!", flush=True)
    print("=" * 70, flush=True)


if __name__ == "__main__":
    run_api_tests()
