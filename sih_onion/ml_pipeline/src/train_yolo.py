"""
train_yolo.py - Fine-tunes YOLOv8-seg model for onion quality detection & segmentation.
"""

import os
import sys
import yaml
from pathlib import Path

sys.path.append(r"C:\Users\abham\AppData\Roaming\Python\Python312\site-packages")
from ultralytics import YOLO


def train_yolo_model(config_path: str = "../config.yaml", dataset_yaml: str = "../../../data/real_onions/data.yaml"):
    """
    Trains YOLOv8-seg model using the parameters specified in config.yaml.
    """
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
    else:
        config = {}

    training_cfg = config.get("training", {})
    model_name = training_cfg.get("model_type", "yolov8n-seg.pt")
    epochs = training_cfg.get("epochs", 30)
    img_size = training_cfg.get("img_size", 640)
    batch_size = training_cfg.get("batch_size", 8)
    device = training_cfg.get("device", "cpu")
    project = training_cfg.get("project", "../models/runs")
    run_name = training_cfg.get("name", "onion_yolov8_seg")

    print(f"[TrainYOLO] Loading pre-trained base model: {model_name}...")
    model = YOLO(model_name)

    abs_yaml = os.path.abspath(dataset_yaml)
    if not os.path.exists(abs_yaml):
        raise FileNotFoundError(f"Dataset YAML file not found at: {abs_yaml}")

    print(f"[TrainYOLO] Starting fine-tuning for {epochs} epochs on {abs_yaml}...")
    
    results = model.train(
        data=abs_yaml,
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        device=device,
        project=project,
        name=run_name,
        exist_ok=True,
        verbose=True
    )

    save_dir = Path(project) / run_name / "weights"
    best_model_path = save_dir / "best.pt"
    
    print(f"[TrainYOLO] Training complete! Best model saved at: {best_model_path}")
    return str(best_model_path)


if __name__ == "__main__":
    train_yolo_model()
