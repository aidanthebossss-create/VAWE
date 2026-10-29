import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const svg = `<svg width="240" height="240" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11426D"/>
      <stop offset="55%" stop-color="#2389A4"/>
      <stop offset="100%" stop-color="#3DAEC5"/>
    </linearGradient>
  </defs>
  <path d="M4,25 Q10,15 16,25 Q22,35 28,25 Q34,15 38,20"
        fill="none" stroke="url(#g)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M4,30 Q10,22 16,30 Q22,38 28,30 Q34,22 38,27"
        fill="none" stroke="url(#g)" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
</svg>`;

const png = await sharp(Buffer.from(svg)).resize(240, 240).png().toBuffer();
writeFileSync('public/email-logo.png', png);
console.log(`[OK] public/email-logo.png (${png.length} bytes)`);
