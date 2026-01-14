const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();

    const htmlPath = path.resolve(__dirname, 'index.html');
    const pdfPath = path.resolve(__dirname, 'CV_Etienne_Gaumery.pdf');

    // Charge le fichier HTML local
    await page.goto('file://' + htmlPath, {
      waitUntil: 'networkidle0',
    });

    // Génère le PDF en format A4 avec les arrière-plans
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      // Police plus grande, on laisse le scale à 1
      scale: 1,
      margin: {
        top: '5mm',
        right: '5mm',
        bottom: '5mm',
        left: '5mm',
      },
    });

    await browser.close();
    console.log('PDF généré :', pdfPath);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
    process.exit(1);
  }
})();
