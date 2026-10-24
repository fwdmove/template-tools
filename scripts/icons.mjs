// Renders the app icon + social thumbnail from SVG. Run: node scripts/icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const icon = (rounded) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b3b"/><stop offset=".55" stop-color="#b3138f"/><stop offset="1" stop-color="#3a12c9"/></linearGradient>
  <linearGradient id="card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e6ee"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffb321"/></linearGradient>
</defs>
<rect width="1024" height="1024" rx="${rounded ? 230 : 0}" fill="url(#bg)"/>
<g opacity=".18" fill="#fff"><circle cx="160" cy="180" r="10"/><circle cx="880" cy="140" r="8"/><circle cx="900" cy="860" r="12"/><circle cx="120" cy="880" r="7"/></g>
<g transform="rotate(-10 512 540)">
  <rect x="300" y="250" width="420" height="560" rx="34" fill="#1b1d26" opacity=".35" transform="translate(-26 26)"/>
  <rect x="300" y="250" width="420" height="560" rx="34" fill="url(#card)"/>
  <rect x="336" y="290" width="348" height="330" rx="18" fill="#2a2f45"/>
  <circle cx="510" cy="420" r="66" fill="#8a93b5"/>
  <path d="M396 620 C404 540 450 512 510 512 C570 512 616 540 624 620 Z" fill="#8a93b5"/>
  <rect x="336" y="650" width="250" height="40" rx="10" fill="#1b1d26"/>
  <rect x="336" y="710" width="170" height="26" rx="8" fill="#9aa1b8"/>
</g>
<path d="M760 214 L792 296 L880 300 L812 354 L836 440 L760 392 L684 440 L708 354 L640 300 L728 296 Z" fill="url(#gold)" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
</svg>`;

const thumb = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14151c"/><stop offset="1" stop-color="#05060a"/></linearGradient>
  <linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b3b"/><stop offset="1" stop-color="#3a12c9"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<g transform="translate(700 70) rotate(8)">
  <rect width="190" height="266" rx="16" fill="#f8de6a" stroke="#c9ccd1" stroke-width="10"/>
  <rect x="18" y="40" width="154" height="110" rx="6" fill="#3a3f52"/>
  <rect x="18" y="170" width="120" height="14" rx="4" fill="#222"/>
  <rect x="18" y="196" width="150" height="10" rx="4" fill="#555"/>
</g>
<g transform="translate(900 120) rotate(-6)">
  <rect width="190" height="266" rx="16" fill="#c9ced6"/>
  <rect x="14" y="14" width="162" height="238" rx="8" fill="#1d428a"/>
  <rect x="14" y="200" width="162" height="52" fill="#000" opacity=".6"/>
</g>
<g transform="translate(640 330) rotate(-4)">
  <rect width="420" height="236" rx="10" fill="#150608" stroke="#333" stroke-width="4"/>
  ${Array.from({ length: 18 }, (_, i) => `<rect x="${14 + (i % 6) * 66}" y="${14 + Math.floor(i / 6) * 50}" width="60" height="44" fill="#3a3a40"/>`).join('')}
  <rect x="60" y="170" width="140" height="56" fill="#e5303a"/><rect x="220" y="170" width="140" height="56" fill="#2d6ff0"/>
</g>
<text x="70" y="250" font-family="Arial Black, Helvetica, sans-serif" font-weight="900" font-size="92" fill="#fff">Template</text>
<text x="70" y="350" font-family="Arial Black, Helvetica, sans-serif" font-weight="900" font-size="92" fill="url(#a)">Tools</text>
<text x="74" y="420" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#9aa1b2">Marvel · Video Games · Sports · Cards</text>
<text x="74" y="470" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#6b7285">Put anyone on any template. Save to Photos.</text>
</svg>`;

writeFileSync('public/icon.svg', icon(true));
const full = Buffer.from(icon(false));
const round = Buffer.from(icon(true));
await sharp(full).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(round).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(full).resize(512, 512).png().toFile('public/icon-512.png');
await sharp(round).resize(64, 64).png().toFile('public/favicon.png');
await sharp(Buffer.from(thumb)).png().toFile('public/og-image.png');
console.log('ok');
