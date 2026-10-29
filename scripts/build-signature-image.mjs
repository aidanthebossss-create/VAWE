// Flattens Aidan's email signature into a single image (PNG + JPEG).
// Mirrors the layout of "email template/signature-aidan.html":
// real wave logo | navy divider | name + role + company + contact, tagline below.
// Run: node scripts/build-signature-image.mjs

import sharp from 'sharp';

const SCALE = 3; // render at 3x for crisp text, displayed small
const s = (n) => Math.round(n * SCALE);

// --- Layout in logical 1x pixels ---
const PAD = 30; // generous margin; trimmed away, then a uniform margin is re-added
const LOGO_W = 110;
const LOGO_H = 50;
const TOP_H = 74; // height of the logo / details row
const LOGO_X = PAD;
const LOGO_Y = PAD + (TOP_H - LOGO_H) / 2;
const DIVIDER_X = LOGO_X + LOGO_W + 18;
const TEXT_X = DIVIDER_X + 3 + 18;
const CANVAS_W = 700;
const CANVAS_H = 170;

const FONT = 'Helvetica, Arial, sans-serif';

const svg = `<svg width="${s(CANVAS_W)}" height="${s(CANVAS_H)}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="#ffffff"/>

  <!-- navy divider -->
  <rect x="${DIVIDER_X}" y="${PAD}" width="3" height="${TOP_H}" fill="#0e7490"/>

  <!-- name -->
  <text x="${TEXT_X}" y="${PAD + 18}" font-family="${FONT}" font-size="17" font-weight="bold" fill="#0c4a6e">Aidan Roach</text>

  <!-- role -->
  <text x="${TEXT_X}" y="${PAD + 35}" font-family="${FONT}" font-size="11" font-weight="bold" fill="#0e7490" letter-spacing="1.9">CO-FOUNDER &#183; VAWES</text>

  <!-- company -->
  <text x="${TEXT_X}" y="${PAD + 49}" font-family="${FONT}" font-size="10" fill="#94a3b8" letter-spacing="2.1">VUYO &amp; AIDAN WEB ENTERPRISES</text>

  <!-- contact (dx offsets used for spacing; librsvg collapses nbsp in tspans) -->
  <text x="${TEXT_X}" y="${PAD + 69}" font-family="${FONT}" font-size="13">
    <tspan fill="#64748b">P</tspan><tspan dx="5" fill="#0e7490">+27 82 707 3112</tspan><tspan dx="10" fill="#94a3b8">&#183;</tspan><tspan dx="10" fill="#64748b">E</tspan><tspan dx="5" fill="#0e7490">info@vawes.site</tspan><tspan dx="10" fill="#94a3b8">&#183;</tspan><tspan dx="10" fill="#64748b">W</tspan><tspan dx="5" fill="#0e7490" font-weight="bold">vawes.site</tspan>
  </text>

  <!-- tagline -->
  <text x="${PAD}" y="${PAD + TOP_H + 21}" font-family="${FONT}" font-size="11" font-style="italic" fill="#94a3b8">We craft digital waves. &#8212; High-performance websites for businesses across South Africa.</text>
</svg>`;

// real wave logo, sized to the signature's logo box
const logo = await sharp('public/logo/vawes-mark.png')
  .resize(s(LOGO_W), s(LOGO_H), { fit: 'fill' })
  .toBuffer();

// compose, flatten onto white, auto-crop, then re-add a uniform white margin
const flat = await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: s(LOGO_X), top: s(LOGO_Y) }])
  .flatten({ background: '#ffffff' })
  .trim({ background: '#ffffff', threshold: 12 })
  .extend({ top: s(14), bottom: s(14), left: s(16), right: s(16), background: '#ffffff' })
  .toBuffer();

const pngPath = 'email template/signature-aidan.png';
const jpgPath = 'email template/signature-aidan.jpg';

await sharp(flat).png().toFile(pngPath);
await sharp(flat).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(jpgPath);

const meta = await sharp(flat).metadata();
console.log(`[OK] ${pngPath}  (${meta.width}x${meta.height})`);
console.log(`[OK] ${jpgPath}  (${meta.width}x${meta.height})`);
