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
    const htmlPath = path.resolve(__dirname, 'cv_sport_outdoor.html');
    console.log('📄 Chargement du fichier HTML:', htmlPath);
    
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });
    
    console.log('📝 Génération du PDF...');
    
    // Générer le PDF
    await page.pdf({
        path: 'CV_Etienne_Gaumery_Sport_Outdoor.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '6mm',
            right: '6mm',
            bottom: '6mm',
            left: '6mm'
        }
    });
    
    console.log('✅ PDF généré avec succès : CV_Etienne_Gaumery_Sport_Outdoor.pdf');
    
    await browser.close();
    console.log('🎉 Terminé !');
}

generatePDF().catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});
