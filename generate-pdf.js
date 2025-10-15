const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du script de génération PDF...');

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
      console.log("💡 Vérifiez que le fichier index.html existe dans le même dossier que ce script");
      return;
    }
    console.log("✅ Fichier HTML trouvé !");

    // 3. Lecture du contenu HTML pour vérification
    console.log('📖 Lecture du contenu HTML...');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    console.log(`✅ Contenu HTML lu (${htmlContent.length} caractères)`);
    
    if (htmlContent.length < 100) {
      console.warn("⚠️  ATTENTION : Le fichier HTML semble très court, il pourrait être vide ou corrompu");
    }

    // 4. Lancement de Puppeteer avec options robustes
    console.log('🌐 Lancement de Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true, // Changez à false pour voir le navigateur
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
      ],
      timeout: 30000 // 30 secondes de timeout
    });
    console.log("✅ Navigateur Puppeteer lancé avec succès");

    // 5. Création d'une nouvelle page...
    const page = await browser.newPage();
    console.log("✅ Nouvelle page créée");

    // 6. Configuration de la page
    console.log('⚙️  Configuration de la page...');
    await page.setViewport({ width: 1200, height: 800 });
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);
    console.log("✅ Viewport configuré (1200x800)");

    // Injecter une balise <base> pour résoudre les URLs relatives (images, CSS locales)
    const baseHref = `file://${__dirname}/`;
    const htmlWithBase = htmlContent.replace(/<head>/i, `<head><base href="${baseHref}">`);

    // 7. Chargement du contenu HTML directement (évite les timeouts file:// et CDN)
    console.log('🌐 Chargement du contenu HTML en mémoire...');
    await page.setContent(htmlWithBase, { waitUntil: 'load' });
    console.log("✅ Contenu HTML chargé avec setContent (waitUntil: 'load')");

    // 8. Attendre que le contenu soit chargé
    console.log('⏳ Attente du chargement complet...');
    try {
      // Attente courte sans bloquer sur le CDN
      await page.waitForTimeout?.(1000);
    } catch {}
    // Forcer l'initialisation des icônes Lucide si présent
    try {
      await page.evaluate(() => {
        if (window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
      });
    } catch {}

    // 9. Vérification du contenu de la page
    console.log('🔍 Vérification du contenu de la page...');
    const pageTitle = await page.title();
    console.log(`📝 Titre de la page : "${pageTitle}"`);
    
    const bodyContent = await page.evaluate(() => document.body.textContent);
    console.log(`📄 Contenu du body : ${bodyContent.length} caractères`);
    
    if (bodyContent.length < 100) {
      console.warn("⚠️  ATTENTION : Le contenu de la page semble très court");
    }

    // 10. Génération du PDF
    console.log('📄 Génération du PDF...');
    try {
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
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
      console.log(`✅ Fichier PDF créé : ${outputPath}`);
      console.log(`📊 Taille du fichier : ${(stats.size / 1024).toFixed(2)} KB`);
      
      if (stats.size < 1000) {
        console.warn("⚠️  ATTENTION : Le fichier PDF semble très petit (< 1 KB), il pourrait être vide");
      }
    } else {
      console.error("❌ ERREUR : Le fichier PDF n'a pas été créé");
    }

    // 12. Fermeture du navigateur
    console.log('🔒 Fermeture du navigateur...');
    await browser.close();
    console.log("✅ Navigateur fermé");

    console.log('🎉 Script terminé avec succès !');
    console.log(`📄 Votre PDF est disponible ici : ${outputPath}`);

  } catch (error) {
    console.error('💥 ERREUR FATALE :', error.message);
    console.error('📋 Détails de l\'erreur :', error.stack);
    
    // Tentative de fermeture du navigateur en cas d'erreur
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
