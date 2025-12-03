const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  console.log('🚀 Démarrage de la génération PDF (Opquast)...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  console.log('🌐 Ouverture du navigateur...');
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'cv_opquast.html');
  console.log('📄 Chargement du fichier HTML:', htmlPath);

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 120000 });
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('📝 Génération du PDF...');
  await page.pdf({
    path: 'CV_Etienne_Gaumery_Opquast.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
  });

  console.log('✅ PDF généré avec succès : CV_Etienne_Gaumery_Opquast.pdf');
  await browser.close();
  console.log('🎉 Terminé !');
}

generatePDF().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
