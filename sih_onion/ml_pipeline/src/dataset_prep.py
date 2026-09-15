"""
dataset_prep.py - Dataset ingestion, validation, synthetic data generation, and split creation.
"""

import os
import shutil
import random
import yaml
import cv2
import numpy as np
from pathlib import Path


def create_dataset_yaml(output_path: str, dataset_dir: str, classes: dict):
    """Creates the dataset.yaml file required by YOLOv8."""
    abs_dataset_dir = os.path.abspath(dataset_dir)
    data = {
        'path': abs_dataset_dir,
        'train': 'train/images',
        'val': 'val/images',
        'names': {int(k): v for k, v in classes.items()}
    }
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
    print(f"[DatasetPrep] Created dataset.yaml at {output_path}")


def validate_yolo_seg_dataset(data_dir: str) -> dict:
    """Validates YOLOv8-seg dataset format."""
    data_path = Path(data_dir)
    images = list(data_path.glob("**/*.jpg")) + list(data_path.glob("**/*.png"))
    labels = list(data_path.glob("**/*.txt"))
    
    report = {
        "valid": len(images) > 0 and len(labels) > 0,
        "total_images": len(images),
        "total_labels": len(labels),
        "missing_labels": []
    }
    
    for img in images:
        lbl_file = img.with_suffix(".txt")
        if not lbl_file.exists():
            report["missing_labels"].append(str(img))

    print(f"[DatasetPrep] Found {len(images)} images, {len(labels)} label files.")
    return report


def generate_synthetic_dataset(output_dir: str, num_images: int = 20):
    """
    Generates synthetic sample images with onions and reference card/coin + YOLO segmentation labels.
    Useful for offline testing before real dataset is provided.
    """
    output_path = Path(output_dir)
    train_img_dir = output_path / "train" / "images"
    train_lbl_dir = output_path / "train" / "labels"
    val_img_dir = output_path / "val" / "images"
    val_lbl_dir = output_path / "val" / "labels"

    for d in [train_img_dir, train_lbl_dir, val_img_dir, val_lbl_dir]:
        d.mkdir(parents=True, exist_ok=True)

    class_names = ["grade_a", "damaged", "rotten", "sprouted", "undersized"]
    
    # Onion color palettes (BGR format for OpenCV)
    onion_colors = {
        0: (40, 80, 180),    # grade_a: nice reddish-purple brown
        1: (20, 50, 100),    # damaged: dark brown spot
        2: (10, 20, 40),     # rotten: very dark/blackish spot
        3: (50, 180, 80),    # sprouted: greenish shoot on top
        4: (50, 90, 160)     # undersized: smaller reddish-purple
    }

    for idx in range(num_images):
        is_val = idx >= int(num_images * 0.8)
        target_img_dir = val_img_dir if is_val else train_img_dir
        target_lbl_dir = val_lbl_dir if is_val else train_lbl_dir

        img_h, img_w = 640, 640
        # Background: light wooden or concrete table
        bg_color = (200 + random.randint(-20, 20), 210 + random.randint(-20, 20), 220 + random.randint(-20, 20))
        img = np.full((img_h, img_w, 3), bg_color, dtype=np.uint8)

        # Draw reference object (Credit Card in top left)
        card_w, card_h = 140, 90
        card_x1, card_y1 = 30, 30
        cv2.rectangle(img, (card_x1, card_y1), (card_x1 + card_w, card_y1 + card_h), (220, 150, 50), -1)
        cv2.rectangle(img, (card_x1, card_y1), (card_x1 + card_w, card_y1 + card_h), (0, 0, 0), 2)
        cv2.putText(img, "REF CARD", (card_x1 + 15, card_y1 + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Generate 4 to 8 onions
        labels_lines = []
        num_onions = random.randint(4, 8)
        grid_positions = [
            (180, 180), (380, 180), (520, 220),
            (160, 400), (360, 420), (530, 440),
            (250, 540), (450, 550)
        ]
        random.shuffle(grid_positions)

        for i in range(num_onions):
            cx, cy = grid_positions[i]
            cls_id = random.choices([0, 1, 2, 3, 4], weights=[0.4, 0.2, 0.15, 0.15, 0.1])[0]
            
            # Size
            r_x = random.randint(45, 65) if cls_id != 4 else random.randint(25, 35)
            r_y = int(r_x * random.uniform(0.85, 1.15))
            angle = random.randint(0, 180)

            color = onion_colors[cls_id]
            cv2.ellipse(img, (cx, cy), (r_x, r_y), angle, 0, 360, color, -1)
            cv2.ellipse(img, (cx, cy), (r_x, r_y), angle, 0, 360, (30, 30, 30), 2)

            # Special defect markings
            if cls_id == 1:  # damaged
                cv2.circle(img, (cx + 5, cy + 5), 12, (20, 30, 60), -1)
            elif cls_id == 2:  # rotten
                cv2.circle(img, (cx - 5, cy - 5), 18, (5, 5, 15), -1)
            elif cls_id == 3:  # sprouted
                cv2.line(img, (cx, cy - r_y), (cx + 10, cy - r_y - 30), (40, 180, 40), 5)

            # Generate polygon for mask
            pts = []
            for a in np.linspace(0, 2 * np.pi, 16, endpoint=False):
                px = cx + r_x * np.cos(a) * np.cos(np.radians(angle)) - r_y * np.sin(a) * np.sin(np.radians(angle))
                py = cy + r_x * np.cos(a) * np.sin(np.radians(angle)) + r_y * np.sin(a) * np.cos(np.radians(angle))
                pts.append(px / img_w)
                pts.append(py / img_h)
            
            pts_str = " ".join([f"{coord:.5f}" for coord in pts])
            labels_lines.append(f"{cls_id} {pts_str}")

        img_file = target_img_dir / f"synth_{idx:03d}.jpg"
        lbl_file = target_lbl_dir / f"synth_{idx:03d}.txt"

        cv2.imwrite(str(img_file), img)
        with open(lbl_file, "w") as f:
            f.write("\n".join(labels_lines))

    print(f"[DatasetPrep] Successfully generated {num_images} synthetic images at {output_dir}")
    
    # Create dataset.yaml
    classes_dict = {0: "grade_a", 1: "damaged", 2: "rotten", 3: "sprouted", 4: "undersized"}
    create_dataset_yaml(str(output_path / "dataset.yaml"), str(output_path), classes_dict)


if __name__ == "__main__":
    generate_synthetic_dataset("./data/synthetic_demo", num_images=25)
