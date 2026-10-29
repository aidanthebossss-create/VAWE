import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

// 1200x630 OG image with VAWES branding
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11426D"/>
      <stop offset="55%" stop-color="#2389A4"/>
      <stop offset="100%" stop-color="#3DAEC5"/>
    </linearGradient>
    <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#6CCCE0" stop-opacity="0.7"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative waves at bottom -->
  <path d="M0,500 C200,540 400,460 600,500 C800,540 1000,460 1200,500 L1200,630 L0,630 Z"
        fill="#FFFFFF" fill-opacity="0.08"/>
  <path d="M0,550 C200,580 400,520 600,550 C800,580 1000,520 1200,550 L1200,630 L0,630 Z"
        fill="#FFFFFF" fill-opacity="0.06"/>

  <!-- VAWES logo (wave) in top-left -->
  <g transform="translate(80, 100)">
    <path d="M0,30 Q20,0 40,30 Q60,60 80,30 Q100,0 120,15"
          fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
    <path d="M0,45 Q20,25 40,45 Q60,65 80,45 Q100,25 120,32"
          fill="none" stroke="#6CCCE0" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
  </g>

  <!-- VAWES wordmark -->
  <text x="80" y="280" font-family="Helvetica, Arial, sans-serif" font-size="36"
        font-weight="700" fill="#FFFFFF" letter-spacing="12" opacity="0.9">VAWES</text>

  <!-- Main headline -->
  <text x="80" y="380" font-family="Helvetica, Arial, sans-serif" font-size="90"
        font-weight="900" fill="white" letter-spacing="-2">We craft</text>
  <text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="90"
        font-weight="900" fill="#6CCCE0" letter-spacing="-2">digital waves.</text>

  <!-- Subhead -->
  <text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-size="28"
        font-weight="400" fill="#FFFFFF" opacity="0.85">
    High-performance websites for South African businesses.
  </text>

  <!-- Website URL -->
  <text x="80" y="590" font-family="monospace" font-size="22"
        font-weight="500" fill="#FFFFFF" opacity="0.7">vawes.site</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og-image.png', png);
console.log(`[OK] public/og-image.png (${png.length} bytes)`);
