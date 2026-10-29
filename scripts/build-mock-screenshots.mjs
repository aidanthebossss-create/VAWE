// Captures a static screenshot of each "Selected Work" portfolio mock, so the
// gallery cards can show a lightweight image instead of 21 live <iframe>s.
// Uses the system Chrome in headless mode (no npm browser dependency) + sharp.
// Re-run whenever a mock in public/mock-*/ changes.
//
//   node scripts/build-mock-screenshots.mjs

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = resolve('.');
const OUT_DIR = join(ROOT, 'public', 'mock-shots');

// Mirrors the `projects` array in src/components/Portfolio.tsx (id -> source).
// Project 1 is an external live site; the rest are local self-contained mocks.
const sources = {
  1: 'https://utimebeauty.co.za/index.html',
  2: 'public/mock-cdc/index.html',
  3: 'public/mock-vexel/index.html',
  4: 'public/mock-bloom/index.html',
  5: 'public/mock-metro96/index.html',
  6: 'public/mock-nexus/index.html',
  7: 'public/mock-vessel/index.html',
};

const toUrl = (src) =>
  src.startsWith('http')
    ? src
    : 'file:///' + resolve(ROOT, src).replace(/\\/g, '/');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let ok = 0;
let failed = 0;

for (const [id, src] of Object.entries(sources)) {
  const tmp = mkdtempSync(join(tmpdir(), 'vawes-shot-'));
  const rawPng = join(tmp, 'shot.png');
  try {
    execFileSync(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--default-background-color=FFFFFFFF',
        '--run-all-compositor-stages-before-draw',
        '--window-size=1280,800',
        '--virtual-time-budget=6000',
        `--screenshot=${rawPng}`,
        toUrl(src),
      ],
      { stdio: 'pipe', timeout: 60000 },
    );

    // The iframe in Portfolio.tsx renders at 1280x800 (16:10). Match that,
    // then ship as WebP — far lighter than a live browsing context.
    const outPath = join(OUT_DIR, `${id}.webp`);
    await sharp(rawPng)
      .resize(1280, 800, { fit: 'cover', position: 'top' })
      .webp({ quality: 80 })
      .toFile(outPath);

    const kb = (statSync(outPath).size / 1024).toFixed(0);
    console.log(`[OK]   ${id}  ${src}  ->  public/mock-shots/${id}.webp  (${kb} KB)`);
    ok++;
  } catch (err) {
    console.error(`[FAIL] ${id}  ${src}\n       ${err.message.split('\n')[0]}`);
    failed++;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

console.log(`\nDone — ${ok} captured, ${failed} failed.`);
if (failed) process.exitCode = 1;
