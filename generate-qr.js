require('dotenv').config();
const QRCode = require('qrcode');
const path = require('path');

const locations = [
  {
    name: 'liverpool',
    url: 'https://www.kombaq.com/spudbrosexpressliverpool',
  },
  {
    name: 'london',
    url: 'https://www.kombaq.com/spudbrosexpresslondon',
  },
];

async function generateQRCodes() {
  for (const location of locations) {
    const outputPath = path.join(__dirname, `qr-${location.name}.png`);
    await QRCode.toFile(outputPath, location.url, {
      type: 'png',
      width: 800,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
    });
    console.log(`QR code generated: qr-${location.name}.png`);
  }
}

generateQRCodes();