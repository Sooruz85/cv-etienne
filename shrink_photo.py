#!/usr/bin/env python3
import sys
from pathlib import Path
from PIL import Image

def shrink(input_path: str, output_path: str, max_size: int = 480, quality: int = 70) -> None:
    img = Image.open(input_path)
    img = img.convert('RGB')
    w, h = img.size
    scale = min(max_size / max(w, h), 1.0)
    if scale < 1.0:
        img = img.resize((int(w*scale), int(h*scale)), Image.LANCZOS)
    img.save(output_path, format='JPEG', quality=quality, optimize=True, progressive=True)

if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else 'photo-profil.jpg'
    dst = sys.argv[2] if len(sys.argv) > 2 else 'photo-profil.jpg'
    max_size = int(sys.argv[3]) if len(sys.argv) > 3 else 480
    quality = int(sys.argv[4]) if len(sys.argv) > 4 else 70
    shrink(src, dst, max_size=max_size, quality=quality)


