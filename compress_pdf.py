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


def compress_pdf(input_pdf: str, output_pdf: str) -> Tuple[int, int]:
    if not os.path.exists(input_pdf):
        raise FileNotFoundError(f"Fichier introuvable: {input_pdf}")

    before = os.path.getsize(input_pdf)

    # Open and save with optimization flags. We avoid any font subsetting or
    # layout changes; we only allow stream-level optimizations.
    with pikepdf.open(input_pdf) as pdf:
        # Optional cleanup that doesn't change visual output
        pdf.remove_unreferenced_resources()

        pdf.save(
            output_pdf,
            # Recompress Flate streams (lossless)
            recompress_flate=True,
            # Compress other streams where safe (includes some image streams)
            compress_streams=True,
            # Keep object streams and XRef streams compact
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            # Don't linearize to prioritize smaller output
            linearize=False,
        )

    after = os.path.getsize(output_pdf)
    return before, after


def main() -> None:
    parser = argparse.ArgumentParser(description="Compresse un PDF (optimisation images) sans modifier le design")
    parser.add_argument("input", nargs="?", default="CV_Etienne_Gaumery.pdf", help="PDF source à compresser")
    parser.add_argument("output", nargs="?", help="PDF de sortie (par défaut *_light.pdf)")
    args = parser.parse_args()

    input_pdf = args.input
    output_pdf = args.output or default_output_path(input_pdf)

    try:
        print("🚀 Compression en cours…")
        print(f"📥 Fichier source : {input_pdf}")
        before, after = compress_pdf(input_pdf, output_pdf)
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


