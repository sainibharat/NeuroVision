"""
NeuroVision Preprocessing & Dataset Loading (Notebooks 01–04).

Standards:
- Input resolution: 224x224 (Bilinear)
- Normalization: ImageNet statistics (Mean [0.485, 0.456, 0.406], Std [0.229, 0.224, 0.225])
- Training Augmentation: RandomRotation(10), RandomAffine(translate=(0.05, 0.05)), ColorJitter(0.1, 0.1)
"""

import os
from typing import Tuple, List, Dict
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms as T, datasets
from PIL import Image

IMG_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


def get_train_transform(img_size: int = IMG_SIZE) -> T.Compose:
    """Returns training augmentation transform matching Notebook 04."""
    return T.Compose([
        T.Resize((img_size, img_size), interpolation=T.InterpolationMode.BILINEAR),
        T.RandomRotation(degrees=10),
        T.RandomAffine(degrees=0, translate=(0.05, 0.05)),
        T.ColorJitter(brightness=0.1, contrast=0.1),
        T.ToTensor(),
        T.Normalize(mean=MEAN, std=STD)
    ])


def get_eval_transform(img_size: int = IMG_SIZE) -> T.Compose:
    """Returns deterministic evaluation transform (val/test/inference)."""
    return T.Compose([
        T.Resize((img_size, img_size), interpolation=T.InterpolationMode.BILINEAR),
        T.ToTensor(),
        T.Normalize(mean=MEAN, std=STD)
    ])


class MRIDataset(Dataset):
    """PyTorch Dataset for MRI images from a list of (image_path, class_idx) tuples."""
    def __init__(self, samples: List[Tuple[str, int]], is_train: bool = False, img_size: int = IMG_SIZE):
        self.samples = samples
        self.transform = get_train_transform(img_size) if is_train else get_eval_transform(img_size)

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        path, label = self.samples[idx]
        img = Image.open(path).convert("RGB")
        return self.transform(img), label


def create_dataloaders(
    data_dir: str,
    batch_size: int = 32,
    num_workers: int = 2
) -> Tuple[Dict[str, DataLoader], List[str]]:
    """
    Creates DataLoaders for 'train', 'val', and 'test' splits from data_dir.
    Matches folder structure: data_dir/{train,val,test}/{class_name}/*.jpg
    """
    train_dir = os.path.join(data_dir, "train")
    if not os.path.isdir(train_dir):
        # Fallback to Title-case if user downloads dataset directly
        train_dir = os.path.join(data_dir, "Training")
    
    classes = sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])

    loaders = {}
    split_map = {"train": ["train", "Training"], "val": ["val"], "test": ["test", "Testing"]}

    for split, candidates in split_map.items():
        found_dir = None
        for c in candidates:
            p = os.path.join(data_dir, c)
            if os.path.isdir(p):
                found_dir = p
                break
        
        if found_dir:
            transform = get_train_transform() if split == "train" else get_eval_transform()
            dataset = datasets.ImageFolder(found_dir, transform=transform)
            loaders[split] = DataLoader(
                dataset,
                batch_size=batch_size,
                shuffle=(split == "train"),
                num_workers=num_workers,
                pin_memory=True
            )

    return loaders, classes
