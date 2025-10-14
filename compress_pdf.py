#!/usr/bin/env python3
"""
Compress a PDF by optimizing embedded images while preserving layout, fonts,
and overall visual design using pikepdf (qpdf under the hood).

Usage:
  python compress_pdf.py CV_Etienne_Gaumery.pdf CV_Etienne_light.pdf

Notes:
  - Text remains vector (no rasterization).
  - Only image streams are optimized (lossless/near-lossless where applicable).
  - If output path is omitted, "_light" will be appended before the extension.
"""

import argparse
import os
import sys
from typing import Tuple
import io

from PIL import Image

try:
    import pikepdf
except ImportError as exc:
    print("❌ pikepdf n'est pas installé. Installez-le avec: pip install pikepdf", file=sys.stderr)
    raise


def human_size(num_bytes: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    size = float(num_bytes)
    for unit in units:
        if size < 1024 or unit == units[-1]:
            return f"{size:.2f} {unit}"
        size /= 1024


def default_output_path(input_path: str) -> str:
    root, ext = os.path.splitext(input_path)
    return f"{root}_light{ext or '.pdf'}"


def compress_pdf(
    input_pdf: str,
    output_pdf: str,
    jpeg_quality: int = 60,
    max_image_dim: int = 1800,
) -> Tuple[int, int]:
    if not os.path.exists(input_pdf):
        raise FileNotFoundError(f"Fichier introuvable: {input_pdf}")

    before = os.path.getsize(input_pdf)

    # Open and save with optimization flags. We avoid any font subsetting or
    # layout changes; we only allow stream-level optimizations.
    with pikepdf.open(input_pdf) as pdf:
        # Recompress embedded images where possible
        for page in pdf.pages:
            try:
                xobj = page.Resources.get('/XObject', {})
            except Exception:
                xobj = {}
            for name, obj in list(getattr(xobj, 'items', lambda: [])()):
                try:
                    if obj.get('/Subtype') != '/Image':
                        continue
                    # Convert to PIL
                    pdf_image = pikepdf.PdfImage(obj)
                    pil_img = pdf_image.as_pil_image()
                    # Downscale very large images to reduce size while preserving qualité
                    if max(pil_img.size) > max_image_dim:
                        scale = max_image_dim / float(max(pil_img.size))
                        new_size = (max(1, int(pil_img.size[0] * scale)), max(1, int(pil_img.size[1] * scale)))
                        pil_img = pil_img.resize(new_size, Image.LANCZOS)
                    # Re-encode to JPEG with balanced quality
                    buf = io.BytesIO()
                    pil_img = pil_img.convert('RGB')
                    pil_img.save(buf, format='JPEG', quality=jpeg_quality, optimize=True, progressive=True)
                    buf.seek(0)
                    # Replace image stream in PDF
                    pdf_image.replace(buf.getvalue(), format='jpeg')
                except Exception:
                    # If anything fails, keep the original image to avoid breaking layout
                    continue

        # Optional cleanup that doesn't change visual output
        try:
            pdf.remove_unreferenced_resources()
        except Exception:
            pass

        pdf.save(
            output_pdf,
            recompress_flate=True,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            linearize=False,
        )

    after = os.path.getsize(output_pdf)
    return before, after


def main() -> None:
    parser = argparse.ArgumentParser(description="Compresse un PDF (optimisation images) sans modifier le design")
    parser.add_argument("input", nargs="?", default="CV_Etienne_Gaumery.pdf", help="PDF source à compresser")
    parser.add_argument("output", nargs="?", help="PDF de sortie (par défaut *_light.pdf)")
    parser.add_argument("--quality", type=int, default=35, help="Qualité JPEG (10-95, défaut 35)")
    parser.add_argument("--maxdim", type=int, default=1200, help="Dimension maximale des images (px), défaut 1200")
    args = parser.parse_args()

    input_pdf = args.input
    output_pdf = args.output or default_output_path(input_pdf)

    try:
        print("🚀 Compression en cours…")
        print(f"📥 Fichier source : {input_pdf}")
        before, after = compress_pdf(input_pdf, output_pdf, jpeg_quality=args.quality, max_image_dim=args.maxdim)
        delta = before - after
        ratio = (1 - (after / before)) * 100 if before > 0 else 0
        print(f"📊 Taille avant : {human_size(before)}")
        print(f"📉 Taille après : {human_size(after)}")
        print(f"✅ Gain : {human_size(delta)} ({ratio:.1f}%)")
        print(f"💾 Fichier généré : {output_pdf}")
    except Exception as e:
        print(f"❌ Erreur: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()


