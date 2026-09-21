// Builds public/images/products/<slug>.webp for every product.
//  - If the supplied pack artwork exists in /reference it is cropped/trimmed.
//  - Otherwise a clean branded placeholder (logo + pack name, no fake photo) is drawn.
// Run: npm run assets:products
import { existsSync, readFileSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/images/products";
const W = 800;
const H = 1000;

/** slug -> real artwork in /reference (front panel crop or trim). */
const REAL = {
  "samrin-strong-100g": {
    file: "reference/1789963243155_image.png",
    mode: "front-panel",
  },
  "samrin-premium-bopf-100g": {
    file: "reference/1789963249562_image.png",
    mode: "front-panel",
  },
  "samrin-premium-bopf-25-tea-bags": {
    file: "reference/1789963255502_image.png",
    mode: "trim",
  },
};

const PRODUCTS = [
  { slug: "samrin-strong-100g", range: "strong", title: "Strong", line: "100 g loose tea" },
  {
    slug: "samrin-premium-bopf-100g",
    range: "bopf",
    title: "Premium BOPF",
    line: "100 g loose tea",
  },
  {
    slug: "samrin-strong-25-tea-bags",
    range: "strong",
    title: "Strong",
    line: "25 tea bags · 45 g",
  },
  {
    slug: "samrin-premium-bopf-25-tea-bags",
    range: "bopf",
    title: "Premium BOPF",
    line: "25 tea bags · 45 g",
  },
  {
    slug: "samrin-strong-100-tea-bags",
    range: "strong",
    title: "Strong",
    line: "100 tea bags · Catering pack",
  },
];

const logoInner = readFileSync("public/brand/samrin-logo-white.svg", "utf8")
  .replace(/^[\s\S]*?<\/title>/, "")
  .replace(/<\/svg>\s*$/, "");

const placeholder = ({ range, title, line }) => {
  const bg = range === "strong" ? "#8F1628" : "#063D24";
  const logoW = 460;
  const s = logoW / 481.51;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#FBF8E7"/>
<rect x="60" y="60" width="680" height="880" fill="${bg}"/>
<rect x="84" y="84" width="632" height="832" fill="none" stroke="#C9A43B" stroke-width="2"/>
<path d="M84 545 C 260 505 460 575 716 515" fill="none" stroke="#C9A43B" stroke-width="2" opacity=".7"/>
<g transform="translate(${(W - logoW) / 2} 150) scale(${s})">${logoInner}</g>
<text x="${W / 2}" y="600" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="6" fill="#E3D39A">PURE CEYLON BLACK TEA</text>
<text x="${W / 2}" y="700" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="#FBF8E7">${title}</text>
<text x="${W / 2}" y="770" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#E3D39A">${line}</text>
<text x="${W / 2}" y="860" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" letter-spacing="4" fill="#C9A43B">RUHUNA · SRI LANKA</text>
</svg>`);
};

for (const p of PRODUCTS) {
  const out = `${OUT}/${p.slug}.webp`;
  const real = REAL[p.slug];
  if (real && existsSync(real.file)) {
    const img = sharp(real.file);
    const { width, height } = await img.metadata();
    let pipeline;
    if (real.mode === "front-panel") {
      // Flat label artwork: the front panel is the centre column (~x 290→790 of 1078 px).
      const left = Math.round((290 / 1078) * width);
      const cropW = Math.round((500 / 1078) * width);
      pipeline = img.extract({ left, top: 0, width: cropW, height });
    } else {
      pipeline = img.trim({ background: "#ffffff", threshold: 12 });
    }
    await pipeline
      .resize({ height: 1200, width: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(out);
    console.log("real       ", out);
  } else {
    await sharp(placeholder(p)).webp({ quality: 90 }).toFile(out);
    console.log("placeholder", out);
  }
}
