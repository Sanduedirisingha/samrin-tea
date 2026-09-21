# /reference

Client-supplied source material. Large binaries are git-ignored; keep them here locally.

| File | Used for |
| --- | --- |
| `Samrin_Tea_Basic_Brand_Digital_Use_Guide 1.docx` | Brand rules (colours, logo use, tone) |
| `Samrin_Product Description.docx` | Approved product copy, prices, brewing artwork |
| `Samrin Logo.eps` | Approved logo (converted to `public/brand/*.svg`) |
| `SAMRIN Tea - Homepage (standalone).html` | Earlier prototype: structure and tone only |
| `1789963243155_image.png` | Strong 100 g pack (flat label) — **not yet supplied** |
| `1789963249562_image.png` | Premium BOPF 100 g pack (flat label) — **not yet supplied** |
| `1789963255502_image.png` | Premium BOPF 25 tea-bag box — **not yet supplied** |

Once the three pack images are in this folder, run `npm run assets:products` to crop them into
`public/images/products/`. Until then branded placeholders are generated.
