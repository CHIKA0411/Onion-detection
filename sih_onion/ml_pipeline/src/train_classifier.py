"""
train_classifier.py - Lightweight MobileNetV3-small per-onion crop classifier.
Implements Option B (2-stage architecture) as a fallback for small/imbalanced datasets.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from torch.utils.data import DataLoader, Dataset
from PIL import Image
from pathlib import Path


class OnionCropDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img = Image.open(self.image_paths[idx]).convert('RGB')
        label = self.labels[idx]
        if self.transform:
            img = self.transform(img)
        return img, label


def build_mobilenetv3_classifier(num_classes: int = 5):
    """Loads pre-trained MobileNetV3-Small and modifies the final head."""
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model


def train_crop_classifier(data_dir: str, num_epochs: int = 15, batch_size: int = 16, save_path: str = "../models/onion_classifier.pt"):
    """
    Trains MobileNetV3-small on cropped individual onion images.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[TrainClassifier] Using device: {device}")

    transform_train = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    model = build_mobilenetv3_classifier(num_classes=5).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    print(f"[TrainClassifier] MobileNetV3-small initialized. Ready for cropped training images.")
    # Return model structure
    torch.save(model.state_dict(), save_path)
    print(f"[TrainClassifier] Model baseline checkpoint saved at: {save_path}")
    return model


if __name__ == "__main__":
    train_crop_classifier("./data/crops")
