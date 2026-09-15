"""
test_backend.py - FastAPI Backend & REST API test script.
"""

import sys
import os
import json
from pathlib import Path

sys.path.append(os.path.abspath("."))
sys.path.append(r"C:\Users\abham\AppData\Roaming\Python\Python312\site-packages")
sys.path.append(os.path.abspath("sih_onion/ml_pipeline/src"))
sys.path.append(os.path.abspath("sih_onion/backend/grading_engine"))

from fastapi.testclient import TestClient
from sih_onion.backend.app.main import app

client = TestClient(app)

def test_api_endpoints():
    print("==================================================")
    print("Testing FastAPI Backend Endpoints (Stage 4)")
    print("==================================================")

    # 1. Test Login
    print("\n[1] Testing Operator Auth Endpoint (/api/v1/auth/login)...")
    res = client.post("/api/v1/auth/login", json={"username": "operator", "password": "password"})
    print("-> Status Code:", res.status_code)
    print("-> Response:", res.json())
    assert res.status_code == 200

    # 2. Test Image Batch Analysis
    print("\n[2] Testing Image Batch Analysis Endpoint (/api/v1/analyze)...")
    test_img_path = "sih_onion/ml_pipeline/data/synthetic_demo/train/images/synth_001.jpg"
    with open(test_img_path, "rb") as img_file:
        res = client.post(
            "/api/v1/analyze",
            files={"file": ("synth_001.jpg", img_file, "image/jpeg")},
            data={"operator_id": "OP_DELHI_02", "center_id": "AZADPUR_MANDI"}
        )
    print("-> Status Code:", res.status_code)
    data = res.json()
    batch_id = data["batch_id"]
    print(f"-> Created Batch ID: {batch_id}, Grade A %: {data['grade_a_pct']}%, URS %: {data['urs_pct']}%")
    assert res.status_code == 200

    # 3. Test Human Override Endpoint
    if data["onions"]:
        print("\n[3] Testing Human Override Endpoint (/api/v1/override)...")
        target_onion_id = data["onions"][0]["id"]
        res_override = client.post(
            "/api/v1/override",
            json={
                "batch_id": batch_id,
                "onion_id": target_onion_id,
                "new_class": "damaged",
                "reviewer_id": "SUPERVISOR_02",
                "reason": "Visual defect spot confirmed"
            }
        )
        print("-> Status Code:", res_override.status_code)
        updated_data = res_override.json()
        print(f"-> Override Applied! Updated Grade A %: {updated_data['grade_a_pct']}%, URS %: {updated_data['urs_pct']}%")
        assert res_override.status_code == 200

    # 4. Test PDF Download Endpoint
    print("\n[4] Testing PDF Report Download Endpoint (/api/v1/reports/{batch_id}/pdf)...")
    res_pdf = client.get(f"/api/v1/reports/{batch_id}/pdf")
    print("-> Status Code:", res_pdf.status_code, "| Content Type:", res_pdf.headers.get("content-type"))
    assert res_pdf.status_code == 200

    # 5. Test Aggregate Stats Endpoint
    print("\n[5] Testing Aggregate Statistics Endpoint (/api/v1/stats)...")
    res_stats = client.get("/api/v1/stats")
    print("-> Status Code:", res_stats.status_code)
    print("-> Aggregate Stats:", res_stats.json())
    assert res_stats.status_code == 200

    # 6. Test Web Dashboard Endpoint
    print("\n[6] Testing Web Dashboard HTML Endpoint (/dashboard)...")
    res_dash = client.get("/dashboard")
    print("-> Status Code:", res_dash.status_code, "| Body Length:", len(res_dash.text))
    assert res_dash.status_code == 200

    print("\n==================================================")
    print("SUCCESS: All FastAPI endpoints tested and verified!")
    print("==================================================")


if __name__ == "__main__":
    test_api_endpoints()
