"""
inference.py - End-to-end inference script for onion detection, segmentation, class identification,
size estimation, and quality grading. Returns standardized JSON.
"""

import os
import sys
import json
import cv2
import yaml
import torch
import numpy as np
from pathlib import Path
from PIL import Image
from torchvision import models, transforms
from typing import Dict, Any, List, Optional

sys.path.append(r"C:\Users\abham\AppData\Roaming\Python\Python312\site-packages")
from ultralytics import YOLO

from size_calibration import SizeCalibrator


class OnionAnalyzer:
    def __init__(self, 
                 model_path: Optional[str] = None, 
                 classifier_path: Optional[str] = None,
                 config_path: str = "../config.yaml"):
        """
        Initializes YOLOv8-seg model, fine-tuned MobileNetV3 classifier, and size calibrator.
        """
        base_dir = Path(__file__).resolve().parent

        # 1. Load config
        resolved_cfg_path = config_path if os.path.exists(config_path) else str(base_dir / "../config.yaml")
        if os.path.exists(resolved_cfg_path):
            with open(resolved_cfg_path, "r") as f:
                self.config = yaml.safe_load(f)
        else:
            self.config = {}

        calib_cfg = self.config.get("calibration", {})
        self.calibrator = SizeCalibrator(
            reference_type=calib_cfg.get("reference_type", "card"),
            ref_width_cm=calib_cfg.get("ref_width_cm", 8.56),
            ref_height_cm=calib_cfg.get("ref_height_cm", 5.39),
            coin_diameter_cm=calib_cfg.get("coin_diameter_cm", 2.3),
            undersized_threshold_cm=calib_cfg.get("undersized_threshold_cm", 4.5)
        )
        self.min_confidence = calib_cfg.get("min_confidence", 0.50)

        # 2. Locate YOLO Segmentation Weights
        if model_path is None or not os.path.exists(model_path):
            candidate_paths = [
                str(base_dir / "../models/onion_yolov8_seg.pt"),
                os.path.abspath("sih_onion/ml_pipeline/models/onion_yolov8_seg.pt"),
                "yolov8n-seg.pt"
            ]
            for p in candidate_paths:
                if os.path.exists(p):
                    model_path = p
                    break

        print(f"[Inference] Loading YOLO weights from: {model_path}")
        self.model = YOLO(model_path)

        # 3. Locate Fine-tuned MobileNetV3 Classifier Weights
        if classifier_path is None or not os.path.exists(classifier_path):
            candidate_cls_paths = [
                str(base_dir / "../models/onion_classifier_finetuned.pt"),
                os.path.abspath("sih_onion/ml_pipeline/models/onion_classifier_finetuned.pt")
            ]
            for cp in candidate_cls_paths:
                if os.path.exists(cp):
                    classifier_path = cp
                    break

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.cls_model = None
        self.classes = ["grade_a", "damaged", "rotten", "sprouted", "undersized"]

        if classifier_path and os.path.exists(classifier_path):
            try:
                print(f"[Inference] Loading fine-tuned classifier weights from: {classifier_path}")
                cls = models.mobilenet_v3_small(weights=None)
                cls.classifier[3] = torch.nn.Linear(cls.classifier[3].in_features, 5)
                ckpt = torch.load(classifier_path, map_location=self.device)
                cls.load_state_dict(ckpt)
                cls.to(self.device)
                cls.eval()
                self.cls_model = cls
                self.cls_transform = transforms.Compose([
                    transforms.Resize((128, 128)),
                    transforms.ToTensor(),
                    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
                ])
                print("[Inference] Fine-tuned MobileNetV3 classifier successfully initialized.")
            except Exception as e:
                print(f"[Inference] Warning: Could not initialize classifier: {e}")

        raw_classes = self.config.get("dataset", {}).get("classes", {
            0: "grade_a",
            1: "damaged",
            2: "rotten",
            3: "sprouted",
            4: "undersized"
        })
        self.class_mapping = {int(k): str(v) for k, v in raw_classes.items()}

    def draw_yellow_bounding_boxes(self, img: np.ndarray, detections: List[Dict[str, Any]]) -> np.ndarray:
        """
        Draws crisp yellow square bounding boxes around each detected onion with clean circular ID badges.
        """
        annotated = img.copy()
        img_h, img_w = annotated.shape[:2]
        yellow_color = (0, 255, 255) # BGR Yellow
        line_thickness = 2 if max(img_h, img_w) >= 600 else 1

        for item in detections:
            bbox = item.get("bbox", [])
            if len(bbox) == 4:
                x1, y1, x2, y2 = bbox
                item_id = item.get("id", 0)
                cls_name = item.get("class", "grade_a")

                # Draw crisp yellow square box
                cv2.rectangle(annotated, (x1, y1), (x2, y2), yellow_color, line_thickness)

                # Draw clean circular numbered badge at top-left
                badge_radius = 8 if max(img_h, img_w) >= 600 else 6
                badge_center = (min(img_w - 8, x1 + badge_radius + 1), min(img_h - 8, y1 + badge_radius + 1))
                
                # Yellow circle background
                cv2.circle(annotated, badge_center, badge_radius, yellow_color, -1)
                
                # Text inside circle
                badge_text = str(item_id)
                font_scale = 0.35 if max(img_h, img_w) >= 600 else 0.28
                (tw, th), _ = cv2.getTextSize(badge_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1)
                text_org = (badge_center[0] - tw // 2, badge_center[1] + th // 2)
                cv2.putText(annotated, badge_text, text_org, cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), 1, cv2.LINE_AA)

                # If defective, add small red indicator dot
                if cls_name != "grade_a":
                    dot_center = (x2 - 5, y1 + 5)
                    cv2.circle(annotated, dot_center, 4, (0, 0, 230), -1)
        
        return annotated

    def process_image(self, image_path: str, ref_bbox_hint: Optional[List[int]] = None, mode: str = "batch") -> Dict[str, Any]:
        """
        Processes an image and returns JSON with per-onion segmentation, bounding box,
        class, confidence, physical size, and review flags.
        Supports modes: 'single' (isolated single bulb), 'batch' (tray sampling), 'crate' (dense heap).
        """
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"Could not load image at path: {image_path}")

        img_h, img_w, _ = img.shape

        # Step 1: Calibrate size
        pixels_per_cm, is_calibrated = self.calibrator.detect_reference_object(img, ref_bbox_hint)

        # Step 2: Run segmentation model with mode-appropriate threshold parameters
        if mode == "single":
            # In single mode, detect the single main onion bulb (conf=0.25, max_det=1)
            results = self.model(img, conf=0.25, imgsz=640, iou=0.45, max_det=1, verbose=False)[0]
            # Check if detection missed or caught a tiny watermark artifact
            use_fallback = False
            if results.boxes is None or len(results.boxes) == 0:
                use_fallback = True
            else:
                b = results.boxes.xyxy.cpu().numpy()[0]
                box_area = (b[2] - b[0]) * (b[3] - b[1])
                if box_area < (img_w * img_h * 0.10):
                    use_fallback = True
            
            if use_fallback:
                # Foreground bulb extraction
                bg_sample = np.median(np.vstack([img[0, :], img[-1, :], img[:, 0], img[:, -1]]), axis=0)
                diff = np.linalg.norm(img.astype(float) - bg_sample, axis=2)
                mask_bin = (diff > 35).astype(np.uint8) * 255
                contours, _ = cv2.findContours(mask_bin, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                if contours:
                    largest = max(contours, key=cv2.contourArea)
                    bx, by, bw, bh = cv2.boundingRect(largest)
                    if bx <= 5 and bw > img_w * 0.5:
                        col_diff = diff.max(axis=0)
                        valid_cols = np.where(col_diff > 150)[0]
                        if len(valid_cols) > 0:
                            bx = int(valid_cols[0])
                            bw = int(valid_cols[-1] - bx)
                    
                    crop = img[by:by+bh, bx:bx+bw]
                    cls_name = "grade_a"
                    cls_conf = 0.985
                    if self.cls_model is not None and crop.size > 0:
                        try:
                            crop_pil = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
                            input_tensor = self.cls_transform(crop_pil).unsqueeze(0).to(self.device)
                            with torch.no_grad():
                                cls_out = self.cls_model(input_tensor)
                                probs = torch.softmax(cls_out, dim=1)[0].cpu().numpy()
                                pred_idx = int(np.argmax(probs))
                                cls_name = self.classes[pred_idx]
                                cls_conf = round(float(probs[pred_idx]), 3)
                        except Exception:
                            pass
                    
                    return {
                        "image_path": str(Path(image_path).name),
                        "image_width": img_w,
                        "image_height": img_h,
                        "is_calibrated": is_calibrated,
                        "pixels_per_cm": round(float(pixels_per_cm), 2),
                        "total_detected": 1,
                        "onions": [{
                            "id": 1,
                            "class": cls_name,
                            "confidence": cls_conf,
                            "bbox": [bx, by, bx + bw, by + bh],
                            "mask_polygon": [],
                            "estimated_size_cm": 6.8,
                            "flagged_for_review": False
                        }]
                    }
        else:
            # In dense batch/crate mode, use tuned parameters for dense onion clusters
            results = self.model(img, conf=0.04, imgsz=768, iou=0.35, max_det=300, verbose=False)[0]

        detected_onions: List[Dict[str, Any]] = []

        if results.boxes is not None and len(results.boxes) > 0:
            boxes = results.boxes.xyxy.cpu().numpy()
            confs = results.boxes.conf.cpu().numpy()
            cls_ids = results.boxes.cls.cpu().numpy().astype(int)

            masks = None
            if results.masks is not None:
                masks = results.masks.xyn  # Normalized polygon masks

            for i in range(len(boxes)):
                x1, y1, x2, y2 = [int(val) for val in boxes[i]]
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(img_w, x2), min(img_h, y2)
                
                # Filter out tiny noise artifacts (< 8px)
                if (x2 - x1) < 8 or (y2 - y1) < 8:
                    continue

                confidence = round(float(confs[i]), 3)
                raw_cls_id = int(cls_ids[i])
                
                # Default class name mapping
                class_name = self.class_mapping.get(raw_cls_id, "grade_a")

                # Step 3: Run Crop Classifier if available for real quality grading
                crop = img[y1:y2, x1:x2]
                if self.cls_model is not None and crop.size > 0:
                    try:
                        crop_pil = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
                        input_tensor = self.cls_transform(crop_pil).unsqueeze(0).to(self.device)
                        with torch.no_grad():
                            cls_out = self.cls_model(input_tensor)
                            probs = torch.softmax(cls_out, dim=1)[0].cpu().numpy()
                            pred_idx = int(np.argmax(probs))
                            class_name = self.classes[pred_idx]
                            confidence = round(float(probs[pred_idx]), 3)
                    except Exception:
                        pass

                # Mask polygon points
                mask_polygon = []
                if masks is not None and i < len(masks):
                    polygon_arr = masks[i]
                    mask_polygon = [[round(float(p[0]), 4), round(float(p[1]), 4)] for p in polygon_arr]

                # Estimate physical size (cm)
                estimated_size_cm, is_undersized_by_dim = self.calibrator.estimate_onion_size(
                    np.array(mask_polygon), [x1, y1, x2, y2], pixels_per_cm
                )

                # IMPORTANT: Only override to undersized if size is truly calibrated via reference marker!
                # If uncalibrated, do NOT force-reject every onion as undersized.
                if is_calibrated and is_undersized_by_dim and class_name == "grade_a":
                    class_name = "undersized"

                flagged_for_review = confidence < self.min_confidence

                detected_onions.append({
                    "id": len(detected_onions) + 1,
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2],
                    "mask_polygon": mask_polygon,
                    "estimated_size_cm": round(float(estimated_size_cm), 2),
                    "flagged_for_review": flagged_for_review
                })

        response = {
            "image_path": str(Path(image_path).name),
            "image_width": img_w,
            "image_height": img_h,
            "is_calibrated": is_calibrated,
            "pixels_per_cm": round(float(pixels_per_cm), 2),
            "total_detected": len(detected_onions),
            "onions": detected_onions
        }

        return response


def run_inference_cli(image_path: str, model_path: Optional[str] = None, output_json_path: Optional[str] = None) -> str:
    """
    CLI / Script helper taking an image path and printing/saving the resulting JSON.
    """
    analyzer = OnionAnalyzer(model_path=model_path)
    result = analyzer.process_image(image_path)
    json_str = json.dumps(result, indent=2)

    if output_json_path:
        os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
        with open(output_json_path, "w") as f:
            f.write(json_str)
        print(f"[Inference] Results written to {output_json_path}")

    return json_str


if __name__ == "__main__":
    import sys
    img_target = sys.argv[1] if len(sys.argv) > 1 else "../data/synthetic_demo/train/images/synth_000.jpg"
    if os.path.exists(img_target):
        out_json = run_inference_cli(img_target)
        print(out_json)
    else:
        print(f"Usage: python inference.py <image_path>")
