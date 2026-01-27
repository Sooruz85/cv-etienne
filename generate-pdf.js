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

    // Charger le fichier HTML en local via file://
    const htmlPath = path.resolve(__dirname, 'index.html');
    console.log('📄 Chargement du fichier HTML:', htmlPath);

    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 120000
    });

    console.log('📝 Génération du PDF...');

    // Générer le PDF avec un rendu fidèle (fond, gradients, marges A4)
    await page.pdf({
        path: 'CV_Etienne_Gaumery.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '8mm',
            right: '8mm',
            bottom: '8mm',
            left: '8mm'
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
