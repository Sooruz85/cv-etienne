const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🚀 Démarrage du script de génération PDF optimisé...');

(async () => {
  try {
    // 1. Vérification des chemins de fichiers
    console.log('📁 Vérification des chemins de fichiers...');
    const filePath = path.resolve(__dirname, 'index.html');
    const outputPath = path.resolve(__dirname, 'CV_Etienne_Gaumery.pdf');
    
    console.log(`📍 Chemin du fichier HTML : ${filePath}`);
    console.log(`📍 Chemin de sortie PDF : ${outputPath}`);

    // 2. Vérification de l'existence du fichier HTML
    console.log('🔍 Vérification de l\'existence du fichier HTML...');
    if (!fs.existsSync(filePath)) {
      console.error("❌ ERREUR : Fichier HTML introuvable :", filePath);
      return;
    }
    console.log("✅ Fichier HTML trouvé !");

    // 3. Lecture du contenu HTML
    console.log('📖 Lecture du contenu HTML...');
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    console.log(`✅ Contenu HTML lu (${htmlContent.length} caractères)`);

    // 4. Lancement de Puppeteer avec options optimisées
    console.log('🌐 Lancement de Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
        // JS nécessaire pour Tailwind CSS (CDN) et rendu correct du CV
      ],
      timeout: 30000
    });
    console.log("✅ Navigateur Puppeteer lancé avec succès");

    // 5. Création d'une nouvelle page
    const page = await browser.newPage();
    console.log("✅ Nouvelle page créée");

    // 6. Configuration de la page
    console.log('⚙️  Configuration de la page...');
    await page.setViewport({ width: 1200, height: 800 });
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);
    console.log("✅ Viewport configuré (1200x800)");

    // 7. Optimisation de la photo (compression) - utilise l'image référencée dans le HTML
    console.log('🖼️ Optimisation de la photo...');
    try {
      const photoCandidates = [
        path.resolve(__dirname, 'photo-profil.jpeg'),
        path.resolve(__dirname, 'photo-profil.jpg'),
        path.resolve(__dirname, 'photo-profil-Christies.jpg'),
        path.resolve(__dirname, 'photo-profil-Christies.jpeg')
      ];
      const imgMatch = htmlContent.match(/src=["']([^"']+\.jpe?g)["']/);
      const ref = imgMatch ? path.basename(imgMatch[1]).replace(/\.(jpe?g)$/i, '') : null;
      const ordered = ref ? [
        ...photoCandidates.filter(p => path.basename(p, path.extname(p)) === ref),
        ...photoCandidates.filter(p => path.basename(p, path.extname(p)) !== ref)
      ] : photoCandidates;
      let chosenPath = null;
      let photoPattern = null;
      for (const p of ordered) {
        if (fs.existsSync(p)) {
          chosenPath = p;
          const basename = path.basename(p, path.extname(p));
          photoPattern = new RegExp(`src=["']${basename}\\.(jpe?g)["']`, 'gi');
          break;
        }
      }
      
      if (chosenPath && photoPattern) {
            // Compression de l'image avec Sharp - qualité optimale
            const imgBuffer = fs.readFileSync(chosenPath);
            const compressedBuffer = await sharp(imgBuffer)
              .resize(300, 300, { 
                fit: 'cover',
                position: 'top'
              }) 
              .jpeg({ quality: 85 })
              .toBuffer();
        
        const base64 = compressedBuffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;
        htmlContent = htmlContent.replace(photoPattern, `src="${dataUri}"`);
        console.log(`✅ Photo compressée et embarquée (${Math.round(compressedBuffer.length / 1024)} KB)`);
      } else {
        console.warn('⚠️  Aucune photo trouvée');
      }
    } catch (e) {
      console.warn('⚠️  Impossible d\'optimiser la photo:', e.message);
    }

    // 8. Chargement du contenu HTML
    console.log('🌐 Chargement du contenu HTML en mémoire...');
    await page.setContent(htmlContent, { waitUntil: 'load' });
    console.log("✅ Contenu HTML chargé");

    // 9. Attendre le chargement complet (Tailwind + polices)
    console.log('⏳ Attente du chargement complet...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 10. Génération du PDF avec options de compression
    console.log('📄 Génération du PDF optimisé...');
    try {
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        },
        // Options d'optimisation
        preferCSSPageSize: true,
        displayHeaderFooter: false
      });
      console.log("✅ PDF généré avec succès !");
    } catch (pdfError) {
      console.error("❌ ERREUR lors de la génération du PDF :", pdfError.message);
      throw pdfError;
    }

    // 11. Vérification du fichier PDF généré
    console.log('🔍 Vérification du fichier PDF généré...');
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ Fichier PDF créé : ${outputPath}`);
      console.log(`📊 Taille du fichier : ${sizeKB} KB (${sizeMB} MB)`);
      
      if (stats.size < 1024 * 1024) { // Moins de 1 MB
        console.log("🎉 Excellent ! Le fichier fait moins de 1 MB");
      } else if (stats.size < 1.5 * 1024 * 1024) { // Moins de 1.5 MB
        console.log("✅ Bon ! Le fichier fait moins de 1.5 MB");
      } else {
        console.log("⚠️  Le fichier fait plus de 1.5 MB, mais c'est acceptable pour un CV de qualité");
      }
    } else {
      console.error("❌ ERREUR : Le fichier PDF n'a pas été créé");
    }

    // 12. Fermeture du navigateur
    console.log('🔒 Fermeture du navigateur...');
    await browser.close();
    console.log("✅ Navigateur fermé");

    console.log('🎉 Script terminé avec succès !');
    console.log(`📄 Votre PDF optimisé est disponible ici : ${outputPath}`);

  } catch (error) {
    console.error('💥 ERREUR FATALE :', error.message);
    console.error('📋 Détails de l\'erreur :', error.stack);
    
    try {
      if (typeof browser !== 'undefined') {
        await browser.close();
        console.log("✅ Navigateur fermé après erreur");
      }
    } catch (closeError) {
      console.error("❌ Erreur lors de la fermeture du navigateur :", closeError.message);
    }
    
    process.exit(1);
  }
})();
