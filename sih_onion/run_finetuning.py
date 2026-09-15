"""
run_finetuning.py - Fine-tunes MobileNetV3 crop classifier on multi-class onion dataset.
Computes validation accuracy, precision, and recall per category.
"""

import os
import sys
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image
import numpy as np

# Set fixed random seed for reproducible validation split
torch.manual_seed(42)
np.random.seed(42)
random.seed(42)

CLASSES = ["grade_a", "damaged", "rotten", "sprouted", "undersized"]
NUM_CLASSES = len(CLASSES)

class RealOnionDataset(Dataset):
    def __init__(self, data_split_dir: str, transform=None):
        self.transform = transform
        self.samples = []
        
        # 1. First check directory-based format: data_split_dir/<class_name>/*.jpg
        if os.path.exists(data_split_dir):
            for cls_idx, cls_name in enumerate(CLASSES):
                cls_folder = os.path.join(data_split_dir, cls_name)
                if os.path.exists(cls_folder):
                    for fname in os.listdir(cls_folder):
                        if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
                            self.samples.append((os.path.join(cls_folder, fname), cls_idx, None))

        # 2. Second check YOLO annotation format: data_split_dir/images and data_split_dir/labels
        img_dir = os.path.join(data_split_dir, "images")
        lbl_dir = os.path.join(data_split_dir, "labels")
        
        if os.path.exists(img_dir) and os.path.exists(lbl_dir):
            for img_name in os.listdir(img_dir):
                if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    continue
                
                img_path = os.path.join(img_dir, img_name)
                lbl_path = os.path.join(lbl_dir, os.path.splitext(img_name)[0] + ".txt")
                
                if not os.path.exists(lbl_path):
                    continue

                try:
                    with open(lbl_path, "r") as f:
                        lines = f.readlines()
                    
                    for line in lines:
                        parts = line.strip().split()
                        if len(parts) < 5:
                            continue
                            
                        cls_id = int(parts[0])
                        coords = list(map(float, parts[1:]))
                        self.samples.append((img_path, cls_id, coords))
                except Exception:
                    pass

        if not self.samples:
            print(f"Warning: No valid samples found in {data_split_dir}.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        item = self.samples[idx]
        img_path = item[0]
        label = item[1]
        coords = item[2]

        image = Image.open(img_path).convert('RGB')
        
        if coords is not None:
            w, h = image.size
            if len(coords) == 4:
                cx, cy, nw, nh = coords
                xmin = max(0, int((cx - nw / 2) * w))
                ymin = max(0, int((cy - nh / 2) * h))
                xmax = min(w, int((cx + nw / 2) * w))
                ymax = min(h, int((cy + nh / 2) * h))
            else:
                xs = coords[0::2]
                ys = coords[1::2]
                xmin = max(0, int(min(xs) * w))
                ymin = max(0, int(min(ys) * h))
                xmax = min(w, int(max(xs) * w))
                ymax = min(h, int(max(ys) * h))
            
            if xmax > xmin and ymax > ymin:
                image = image.crop((xmin, ymin, xmax, ymax))

        if self.transform:
            image = self.transform(image)

        return image, label


def train_and_eval():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[FineTune] Execution device: {device}")

    transform_train = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    transform_val = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    base_data_path = os.path.join(project_root, "data", "real_onions", "classifier")
    train_dir = os.path.join(base_data_path, "train")
    val_dir = os.path.join(base_data_path, "val")
    
    if not os.path.exists(train_dir):
        base_data_path = os.path.join(project_root, "data", "real_onions")
        train_dir = os.path.join(base_data_path, "train")
        val_dir = os.path.join(base_data_path, "val")

    train_dataset = RealOnionDataset(train_dir, transform=transform_train)
    val_dataset = RealOnionDataset(val_dir, transform=transform_val)
    
    train_size = len(train_dataset)
    val_size = len(val_dataset)
    
    if train_size == 0:
        print(f"Error: No training data found at {train_dir}. Please run download_real_data.py first!")
        return

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)

    # Load MobileNetV3-Small
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, NUM_CLASSES)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

    print(f"[FineTune] Starting fine-tuning on {train_size} train samples, {val_size} val samples (3 epochs)...", flush=True)

    model.train()
    for epoch in range(3):
        running_loss = 0.0
        for batch_idx, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print(f"Epoch [{epoch+1}/3] - Loss: {running_loss/len(train_loader):.4f}", flush=True)

    print("[FineTune] Training complete. Evaluating on validation split...")

    # Evaluation
    model.eval()
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.cpu().numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # Calculate overall accuracy
    overall_acc = np.mean(all_preds == all_targets) * 100

    print(f"\n==================================================")
    print(f"FINE-TUNING EVALUATION METRICS (OVERALL ACCURACY: {overall_acc:.2f}%)")
    print(f"==================================================")
    print(f"{'Category':<16} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10}")
    print("-" * 55)

    metrics_result = {}

    for i, cls_name in enumerate(CLASSES):
        tp = np.sum((all_preds == i) & (all_targets == i))
        fp = np.sum((all_preds == i) & (all_targets != i))
        fn = np.sum((all_preds != i) & (all_targets == i))
        tn = np.sum((all_preds != i) & (all_targets != i))

        acc = ((tp + tn) / len(all_targets)) * 100 if len(all_targets) > 0 else 0
        prec = (tp / (tp + fp)) * 100 if (tp + fp) > 0 else 0
        rec = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0

        metrics_result[cls_name] = {"accuracy": acc, "precision": prec, "recall": rec}
        print(f"{cls_name.capitalize():<16} | {acc:>8.2f}% | {prec:>8.2f}% | {rec:>8.2f}%")

    save_path = "sih_onion/ml_pipeline/models/onion_classifier_finetuned.pt"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"\n[FineTune] Fine-tuned model checkpoint saved to: {save_path}")

if __name__ == "__main__":
    train_and_eval()
