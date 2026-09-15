import sys
import os
import json

sys.path.append(os.path.abspath("."))
sys.path.append(r"C:\Users\abham\AppData\Roaming\Python\Python312\site-packages")
sys.path.append(os.path.abspath("sih_onion/ml_pipeline/src"))
sys.path.append(os.path.abspath("sih_onion/backend/grading_engine"))

from inference import OnionAnalyzer
from engine import GradingEngine

def eval_user_image():
    img_path = "sih_onion/storage/uploads/batch_20260910_235530_Red-onions.-Photo-Pexels-Nothing-Ahead-scaled-3944578508.jpg"
    if not os.path.exists(img_path):
        print("Image file not found:", img_path)
        return

    az = OnionAnalyzer(model_path="yolov8n-seg.pt", config_path="sih_onion/ml_pipeline/config.yaml")
    inf_res = az.process_image(img_path)
    
    ge = GradingEngine("sih_onion/backend/config/grading_rules.yaml")
    eval_res = ge.evaluate_batch(inf_res)

    print("==================================================")
    print("EVALUATION RESULTS FOR USER ONION BUNCH IMAGE:")
    print("==================================================")
    print("Total Onions Detected:", eval_res["total_count"])
    print("Grade A %:", eval_res["grade_a_pct"], "%")
    print("URS %:", eval_res["urs_pct"], "%")
    print("Defect Breakdown:", eval_res["defect_breakdown"])
    print("\nIndividual Onion Classes:")
    for o in eval_res["onions"]:
        print(f"-> ID #{o['id']}: Class = {o['class']}, Confidence = {o['confidence']}, Size = {o['estimated_size_cm']}cm")

if __name__ == "__main__":
    eval_user_image()
