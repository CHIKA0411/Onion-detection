import os
import shutil
import random
from pathlib import Path

# Raw Dataset Directory provided by user
RAW_DATASET_DIR = Path(r"C:\Users\BINA\Downloads\Red and White Onion Dataset")
TARGET_DIR = Path(r"c:\Users\BINA\Downloads\sih onion\sih onion\data\real_onions")

# Target class mappings for MobileNetV3 quality classifier
# grade_a (healthy red/white onion bulbs) vs damaged / rotten / unhealthy
CLASS_MAPPING = {
    'grade_a': [
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Healthy" / "Red Onion" / "Single",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Healthy" / "Red Onion" / "Multiple",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Healthy" / "White Onion" / "Single",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Healthy" / "White Onion" / "Multiple",
    ],
    'rotten': [
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Unhealthy" / "Red Onion" / "Single",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Unhealthy" / "Red Onion" / "Multiple",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Unhealthy" / "White Onion" / "Single",
        RAW_DATASET_DIR / "New Onion" / "Bulb" / "Unhealthy" / "White Onion" / "Multiple",
    ]
}

def prepare_real_dataset():
    print("Preparing Real Mendeley Onion Dataset for MobileNetV3 & Segmenter Training...")
    
    # Create target train/val directories
    train_dir = TARGET_DIR / "classifier" / "train"
    val_dir = TARGET_DIR / "classifier" / "val"
    
    if TARGET_DIR.exists():
        shutil.rmtree(TARGET_DIR)
        
    for cls in ['grade_a', 'rotten', 'damaged', 'sprouted', 'undersized']:
        (train_dir / cls).mkdir(parents=True, exist_ok=True)
        (val_dir / cls).mkdir(parents=True, exist_ok=True)

    summary = {}
    
    for cls_name, source_paths in CLASS_MAPPING.items():
        all_files = []
        for src_path in source_paths:
            if src_path.exists():
                imgs = list(src_path.glob("*.jpg")) + list(src_path.glob("*.png"))
                all_files.extend(imgs)
        
        random.seed(42)
        random.shuffle(all_files)
        
        # Sample up to 1000 images per class for balanced fine-tuning
        sampled_files = all_files[:1000]
        split_idx = int(len(sampled_files) * 0.8)
        train_files = sampled_files[:split_idx]
        val_files = sampled_files[split_idx:]
        
        for f in train_files:
            shutil.copy(f, train_dir / cls_name / f.name)
            
        for f in val_files:
            shutil.copy(f, val_dir / cls_name / f.name)
            
        summary[cls_name] = {'train': len(train_files), 'val': len(val_files)}

    print("Real Mendeley Dataset Successfully Prepared:")
    for cls, counts in summary.items():
        print(f"  Class '{cls}': {counts['train']} Train images, {counts['val']} Val images")

if __name__ == "__main__":
    prepare_real_dataset()
