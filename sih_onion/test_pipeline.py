"""
test_pipeline.py - Verification script testing Stage 1 (Inference) and Stage 2 (Grading + PDF Generation).
"""

import sys
import os
import json
from pathlib import Path

# Add user site-packages if needed
sys.path.append(r"C:\Users\abham\AppData\Roaming\Python\Python312\site-packages")
sys.path.append(os.path.abspath("sih_onion/ml_pipeline/src"))
sys.path.append(os.path.abspath("sih_onion/backend/grading_engine"))

from inference import OnionAnalyzer
from engine import GradingEngine
from pdf_generator import generate_quality_pdf_report


def run_pipeline_test():
    print("==================================================")
    print("SIH26031 Pipeline Verification Test (Stage 1 & 2)")
    print("==================================================")

    user_img = r"C:\Users\BINA\.gemini\antigravity-ide\brain\67ade0ef-746e-4d03-ba67-c8a09cb417ac\.user_uploaded\media_1789407017638.jpg"
    test_image = sys.argv[1] if len(sys.argv) > 1 else (user_img if os.path.exists(user_img) else "sih_onion/ml_pipeline/data/synthetic_demo/train/images/synth_000.jpg")
    if not os.path.exists(test_image):
        print(f"Error: Test image missing at {test_image}")
        return

    print(f"-> Target Inspection Image: {test_image}")

    # Step 1: Stage 1 Inference
    print("\n[Step 1] Running Stage 1 Image Inference...")
    analyzer = OnionAnalyzer(
        model_path="sih_onion/ml_pipeline/models/onion_yolov8_seg.pt",
        config_path="sih_onion/ml_pipeline/config.yaml"
    )
    inference_result = analyzer.process_image(test_image)
    print(f"-> Detected {inference_result['total_detected']} onions.")
    print(f"-> Size Calibrated: {inference_result['is_calibrated']} ({inference_result['pixels_per_cm']} px/cm)")

    # Step 2: Stage 2 Quality Evaluation
    print("\n[Step 2] Evaluating Quality Grade & URS Ratios...")
    engine = GradingEngine("sih_onion/backend/config/grading_rules.yaml")
    batch_eval = engine.evaluate_batch(inference_result, operator_id="OPERATOR_DEMO_01")
    
    print(f"-> Batch ID: {batch_eval['batch_id']}")
    print(f"-> Total Assessed: {batch_eval['total_count']}")
    print(f"-> Grade A Ratio: {batch_eval['grade_a_pct']}% ({batch_eval['grade_a_count']} onions)")
    print(f"-> URS Ratio: {batch_eval['urs_pct']}% ({batch_eval['urs_count']} onions)")
    print(f"-> Defect Breakdown: {batch_eval['defect_breakdown']}")

    # Step 3: Human Override Test
    if batch_eval['total_count'] > 0:
        print("\n[Step 3] Applying Human Override Audit Test...")
        first_onion_id = batch_eval['onions'][0]['id']
        orig_cls = batch_eval['onions'][0]['class']
        new_cls = "damaged" if orig_cls != "damaged" else "grade_a"
        
        batch_eval = engine.apply_human_override(
            batch_eval, 
            onion_id=first_onion_id, 
            new_class=new_cls, 
            reviewer_id="SUPERVISOR_01", 
            reason="Demo manual reclassification"
        )
        print(f"-> Reclassified Onion #{first_onion_id} from '{orig_cls}' to '{new_cls}'.")
        print(f"-> Updated Grade A Ratio: {batch_eval['grade_a_pct']}%, Updated URS Ratio: {batch_eval['urs_pct']}%")

    # Step 4: PDF Quality Report Generation
    print("\n[Step 4] Generating PDF Quality Report...")
    output_pdf = "sih_onion/test_output/quality_report_demo.pdf"
    pdf_path = generate_quality_pdf_report(batch_eval, test_image, output_pdf)
    print(f"-> Quality PDF Report generated at: {pdf_path}")

    print("\n==================================================")
    print("SUCCESS: Stage 1 and Stage 2 pipelines verified!")
    print("==================================================")


if __name__ == "__main__":
    run_pipeline_test()
