const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
    console.log('🚀 Démarrage de la génération PDF...');

    const browser = await puppeteer.launch({
        headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    console.log('🌐 Ouverture du navigateur...');
    const page = await browser.newPage();

    // Charger le fichier HTML
    const htmlPath = path.resolve(__dirname, 'index.html');
    console.log('📄 Chargement du fichier HTML:', htmlPath);

    // Increase timeout and ensure styles are applied
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 120000
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('📝 Génération du PDF...');

    // Générer le PDF
      await page.pdf({
        path: 'CV_Etienne_Gaumery.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
    });

    console.log('✅ PDF généré avec succès : CV_Etienne_Gaumery.pdf');

    await browser.close();
    console.log('🎉 Terminé !');
}

generatePDF().catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});
