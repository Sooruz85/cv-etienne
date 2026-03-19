#!/usr/bin/env node
/**
 * Intègre la photo de profil en base64 dans index.html pour affichage garanti dans le cercle.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = __dirname;
const photoPath = path.join(dir, 'photo-profil.jpeg');
const htmlPath = path.join(dir, 'index.html');

if (!fs.existsSync(photoPath)) {
  console.error('Fichier photo-profil.jpeg introuvable.');
  process.exit(1);
}

(async () => {
  try {
    const imgBuffer = fs.readFileSync(photoPath);
    const compressedBuffer = await sharp(imgBuffer)
      .resize(416, 416, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 88 })
      .toBuffer();
    const base64 = compressedBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace(
      /src="\.\/photo-profil\.jpeg"/g,
      `src="${dataUri}"`
    );
    html = html.replace(
      /src="photo-profil\.jpeg"/g,
      `src="${dataUri}"`
    );

    fs.writeFileSync(htmlPath, html);
    console.log('Photo intégrée dans index.html (' + Math.round(compressedBuffer.length / 1024) + ' KB en base64).');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
