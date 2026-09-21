// Derives web-ready logo variants from public/brand/samrin-logo.svg, which was
// converted 1:1 from the approved Samrin Logo.eps (paths only, nothing redrawn).
// Single-colour versions only change fill colours. Run: node scripts/build-brand-assets.mjs
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync("public/brand/samrin-logo.svg", "utf8");
const paths = [...src.matchAll(/<path fill="(#\w+)"([^>]*?)d="([^"]+)"\s*\/>/g)].map((m) => ({
  fill: m[1],
  attrs: m[2],
  d: m[3],
}));
const VIEWBOX = "0 0 481.51 330.01";
const FOREST = "#0f6c37"; // the logo's own green
const INK = "#221f1f";

const render = (list, fill, viewBox = VIEWBOX) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="SAMRIN Tea"><title>SAMRIN Tea</title>\n` +
  list.map((p) => `<path fill="${fill ?? p.fill}"${p.attrs}d="${p.d}"/>`).join("\n") +
  "\n</svg>\n";

const withoutFill = paths.slice(1); // path 0 is the white oval interior
const variants = {
  "samrin-logo-white": render(withoutFill, "#ffffff"),
  "samrin-logo-green": render(withoutFill, FOREST),
  "samrin-logo-black": render(withoutFill, INK),
  "samrin-mark": render(paths.slice(14, 18), null, "168 16 132 142"),
};
for (const [name, svg] of Object.entries(variants)) {
  writeFileSync(`public/brand/${name}.svg`, svg);
}

await sharp("public/brand/samrin-logo.svg", { density: 400 })
  .resize({ width: 1200 })
  .png()
  .toFile("public/brand/samrin-logo.png");
await sharp("public/brand/samrin-logo-white.svg", { density: 400 })
  .resize({ width: 1200 })
  .png()
  .toFile("public/brand/samrin-logo-white.png");

// Favicon / app icons: the leaf mark from the logo on the brand cream.
const markSvg = variants["samrin-mark"];
const icon = async (size, bg, out) => {
  const inner = Math.round(size * 0.66);
  const mark = await sharp(Buffer.from(markSvg), { density: 600 })
    .resize({ width: inner, height: inner, fit: "contain", background: "#0000" })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out);
};
await icon(512, "#FBF8E7", "src/app/icon.png");
await icon(180, "#FBF8E7", "src/app/apple-icon.png");

// Default social share image: full-colour logo on forest with a gold hairline frame.
const logoPng = await sharp("public/brand/samrin-logo.svg", { density: 400 })
  .resize({ height: 400 })
  .png()
  .toBuffer();
const frame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#063D24"/><rect x="28" y="28" width="1144" height="574" fill="none" stroke="#C9A43B" stroke-width="2"/><path d="M0 560 C 300 470 700 640 1200 500" fill="none" stroke="#C9A43B" stroke-width="2" opacity=".6"/></svg>`,
);
await sharp(frame)
  .composite([{ input: logoPng, gravity: "center" }])
  .png()
  .toFile("src/app/opengraph-image.png");
console.log("brand assets written");
