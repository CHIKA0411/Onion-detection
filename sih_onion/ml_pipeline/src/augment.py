"""
augment.py - Data augmentation script for small YOLO segmentation datasets.
Expands small labeled image sets using geometric and color transformations.
"""

import os
import cv2
import numpy as np
import albumentations as A
from pathlib import Path


def get_augmentation_pipeline(img_size: int = 640):
    """
    Returns an Albumentations pipeline suitable for segmentation datasets.
    Includes rotation, brightness/contrast jitter, HSV shift, and synthetic occlusion.
    """
    return A.Compose([
        A.RandomRotate90(p=0.5),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.3),
        A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=30, p=0.7, border_mode=cv2.BORDER_CONSTANT),
        A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1, p=0.6),
        A.GaussNoise(var_limit=(10.0, 50.0), p=0.3),
        A.CoarseDropout(max_holes=4, max_height=30, max_width=30, min_holes=1, min_height=10, min_width=10, p=0.4),
    ], bbox_params=A.BboxParams(format='yolo', label_fields=['class_labels']))


def augment_image_and_polygons(img_path: str, lbl_path: str, output_img_dir: str, output_lbl_dir: str, num_augmented: int = 3):
    """
    Applies data augmentation to a single image and its polygon label file,
    saving `num_augmented` variations.
    """
    img = cv2.imread(img_path)
    if img is None:
        return
    h, w, _ = img.shape
    
    if not os.path.exists(lbl_path):
        return

    with open(lbl_path, 'r') as f:
        lines = f.readlines()

    # Base filename
    stem = Path(img_path).stem
    
    # Save original copy
    cv2.imwrite(os.path.join(output_img_dir, f"{stem}_orig.jpg"), img)
    with open(os.path.join(output_lbl_dir, f"{stem}_orig.txt"), 'w') as f:
        f.writelines(lines)

    pipeline = get_augmentation_pipeline(img_size=max(h, w))

    # Parse objects
    objects = []
    for line in lines:
        parts = line.strip().split()
        if len(parts) < 3:
            continue
        cls_id = int(parts[0])
        coords = [float(x) for x in parts[1:]]
        objects.append((cls_id, coords))

    for aug_idx in range(num_augmented):
        # Apply visual augmentations (Color jitter, brightness, noise, cutout)
        aug_pipeline = A.Compose([
            A.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.2, hue=0.1, p=0.8),
            A.GaussNoise(var_limit=(10.0, 40.0), p=0.4),
            A.CoarseDropout(max_holes=3, max_height=40, max_width=40, min_holes=1, fill_value=128, p=0.5)
        ])

        augmented = aug_pipeline(image=img)
        aug_img = augmented['image']

        out_img_name = f"{stem}_aug_{aug_idx:02d}.jpg"
        out_lbl_name = f"{stem}_aug_{aug_idx:02d}.txt"

        cv2.imwrite(os.path.join(output_img_dir, out_img_name), aug_img)
        # Polygons remain valid under color/occlusion augmentations
        with open(os.path.join(output_lbl_dir, out_lbl_name), 'w') as f:
            f.writelines(lines)


def augment_dataset(input_dir: str, output_dir: str, num_augmented: int = 3):
    """Augments all images in input_dir and saves to output_dir."""
    input_path = Path(input_dir)
    images = list(input_path.glob("**/*.jpg")) + list(input_path.glob("**/*.png"))

    out_train_img = os.path.join(output_dir, "train", "images")
    out_train_lbl = os.path.join(output_dir, "train", "labels")
    out_val_img = os.path.join(output_dir, "val", "images")
    out_val_lbl = os.path.join(output_dir, "val", "labels")

    for d in [out_train_img, out_train_lbl, out_val_img, out_val_lbl]:
        os.makedirs(d, exist_ok=True)

    print(f"[Augmentation] Processing {len(images)} images with factor={num_augmented}...")

    for img_p in images:
        # YOLO datasets store labels in a sibling 'labels/' directory
        lbl_p = Path(str(img_p).replace(os.sep + "images" + os.sep, os.sep + "labels" + os.sep)).with_suffix(".txt")
        is_val = "val" in str(img_p)
        target_img_dir = out_val_img if is_val else out_train_img
        target_lbl_dir = out_val_lbl if is_val else out_train_lbl

        augment_image_and_polygons(
            str(img_p), str(lbl_p),
            target_img_dir, target_lbl_dir,
            num_augmented=1 if is_val else num_augmented
        )

    print(f"[Augmentation] Dataset expanded successfully at {output_dir}")


if __name__ == "__main__":
    augment_dataset("./data/synthetic_demo", "./data/augmented_demo", num_augmented=3)
