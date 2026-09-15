"""
export.py - Model export pipeline converting PyTorch weights (.pt) to ONNX and TFLite formats.
"""

import os
from pathlib import Path
from ultralytics import YOLO


def export_yolo_to_onnx_and_tflite(weights_path: str, output_dir: str = "../models/exported"):
    """
    Exports a trained YOLOv8-seg PyTorch model to:
    1. ONNX format
    2. TFLite format (Float16/INT8 quantized)
    """
    if not os.path.exists(weights_path):
        print(f"[Export] Base weights file not found at {weights_path}, creating standard YOLOv8n-seg export as fallback...")
        model = YOLO("yolov8n-seg.pt")
    else:
        print(f"[Export] Loading model from {weights_path}...")
        model = YOLO(weights_path)

    os.makedirs(output_dir, exist_ok=True)

    print("[Export] Exporting to ONNX format...")
    onnx_path = model.export(format="onnx", imgsz=640, dynamic=False, opset=12)
    print(f"[Export] ONNX model exported: {onnx_path}")

    print("[Export] Exporting to TFLite format...")
    try:
        tflite_path = model.export(format="tflite", imgsz=640, int8=False)
        print(f"[Export] TFLite model exported: {tflite_path}")
    except Exception as e:
        print(f"[Export] TFLite export warning: {e}. Ensure tensorflow/tflite converters are installed.")

    return {
        "onnx": str(onnx_path) if 'onnx_path' in locals() else None,
        "tflite": str(tflite_path) if 'tflite_path' in locals() else None
    }


if __name__ == "__main__":
    export_yolo_to_onnx_and_tflite("yolov8n-seg.pt", "./models/exported")
