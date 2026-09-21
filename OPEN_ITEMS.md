# OPEN_ITEMS — assumptions, missing assets, client confirmations

Last updated 21 September 2026. Ordered by how much each item affects launch.

## 0. Design source (updated)

The visual design now follows **"SAMRIN Tea - Homepage (standalone).html"** as requested: dark green (`#0E1A14`/`#16281D`)
with a copper accent (`#C46A22`, amber `#E9A354`), cream/ivory light sections, Newsreader + Instrument Sans with an
italic accent word, a sticky dark header, a glowing orb, a pinned horizontal "making" strip, a pinned brewing sequence
where the orb warms from green to amber, and a shop with a left filter sidebar. Decisions to confirm:

- **This departs from the brand guide** (green / cream / **gold** family; CTAs in forest green). Copper replaces gold and the
  primary CTA on dark sections is copper. Burgundy is still used only for the Strong range. Tokens are all in
  `src/app/globals.css` if you want to move back toward gold.
- **The prototype's typed "SAMRIN TEA" wordmark is replaced by the approved logo (reversed)**, because the brand guide says the wordmark must
  come from the logo artwork.
- **Prototype photos are not used.** They are labelled "stock reference", and one shows another brand's sign ("DAMRO Tea"). Image-less panels use
  the design's hatch texture instead. Real Samrin photography can drop into the Origin/Making tiles.
- **Prototype copy that could not be verified was replaced with approved copy** (e.g. "leaf arrives the same day it comes off the bush",
  "fine-cut", "Price TBC", the internal notes cards). "A cup with backbone." is kept as the headline (client-supplied design).
  The "making" cards use only facts from the product document (withering → sifting, ISO scope, packed at factory, tea bags at a specialist facility).
- **Pinned scroll sections** run only at ≥ 1024 px without reduced-motion; phones and reduced-motion users get a swipeable strip and a step list.
- **Story page (`/about`)** now opens with the design's "A new tea, told plainly." section: three photo slots plus three text cards. The slots show the design's
  hatch texture with captions from approved copy; drop real Samrin photos in (`src/components/sections/story.tsx`) when available. The prototype's
  internal-note cards ("What we don't say yet", "Language") were replaced with public-facing statements from the approved copy.
- The prototype's in-page shop/product/contact sections map to the real routes (`/shop`, `/shop/[slug]`, `/contact`); its inline enquiry form and map were not reproduced.

## A. Blockers to verify before anyone relies on the site

1. **Neon was not tested.** No Neon connection string was available while building. Everything was built
   for Neon (`@neondatabase/serverless` WebSocket Pool + `drizzle-orm/neon-serverless`, chosen because
   `neon-http` cannot run interactive transactions) but tested end-to-end against a **local Postgres**
   (`npm run db:local`) through the `pg` driver. The Neon code path type-checks and builds, and is selected
   automatically for any non-localhost `DATABASE_URL`, but it has **not been exercised**.
   → Put the pooled dev-branch URL in `.env.local`, then run `npm run db:migrate && npm run db:seed`,
   place a test order and confirm it appears in Drizzle Studio.
   `.env.local` currently points at the local database — replace it.
2. **Three pack images were not in the project folder** (only 4 of the 7 files arrived: logo EPS, prototype
   HTML, product DOCX, brand-guide DOCX). Missing: `1789963243155_image.png` (Strong 100 g),
   `1789963249562_image.png` (Premium BOPF 100 g), `1789963255502_image.png` (Premium BOPF 25 bags box).
   → Copy them into `/reference` and run `npm run assets:products` (crops the front panel ≈ x 290→790 of
   1078 px, trims the box mock-up). Until then all five products show a clean branded placeholder
   (logo + pack name, burgundy for Strong) — no fake photography.
3. **Privacy policy is a draft** and must be reviewed by legal counsel before launch (Sri Lanka PDPA No. 9 of 2022
   wording, controller identity, retention periods, cross-border transfer language, regulator reference).
   Also consider terms of sale / delivery & returns pages (checkout only links the privacy policy).

## B. Assets needed

| Asset                                                            | Status                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strong 100 g, Premium BOPF 100 g, Premium BOPF 25-bag box images | Not supplied (see A2). Placeholders in use                                                                                                                                                                                                                              |
| **Strong 25-bag box** photo/mock-up                              | Never supplied. Graphic placeholder                                                                                                                                                                                                                                     |
| **Strong 100-bag catering pack** photo/mock-up                   | Never supplied. Graphic placeholder                                                                                                                                                                                                                                     |
| Photos for the 8 photo slots (Origin, Making ×4, Story ×3)       | Not supplied. Slots are built (`src/content/site-images.ts`) and show the design texture until filled. Third-party Commons photos were **not** added pending your decision (CC BY / BY-SA credit required; several show other companies' factories or the wrong region) |
| Factory photo (About page)                                       | Not supplied and the pack artwork that would contain it is missing. About uses a typographic panel                                                                                                                                                                      |
| Official single-colour logos (green / black / white)             | Only the full-colour EPS was supplied. The white, green and black versions in `public/brand/` are the same vector paths with fills recoloured (no redrawing). Replace if official files exist                                                                           |
| Logo conversion                                                  | `Samrin Logo.eps` → SVG was converted path-for-path with Ghostscript (no Illustrator available). Please compare against the original once                                                                                                                               |
| Brew images                                                      | Extracted from the product DOCX (`public/images/brew/`). The DOCX copies are ~1.7–2 k px wide; supply larger originals if available                                                                                                                                     |

## C. Content that needs client confirmation

- **Strong 100 g "Tea" row.** The summary table says "Pure Ceylon black tea"; the product page says
  "BOPF pure Ceylon black tea". The site shows the product-page wording.
- **Tea-bag product details** have no "Origin" row in the document (Pack / Net weight / Tea / Source only);
  kept exactly as supplied. Loose-tea products do show "Origin: Ruhuna, Sri Lanka".
- **Spelling:** pack art says "Ruhunu"; web copy follows the documents ("Ruhuna").
- **Working prices** (Rs. 320 / 360 / 330 / 410) are seeded and editable in the database. Catering pack
  has no price (business quote).
- **Trust strip wording.** Uses "ISO 22000:2018-certified tea manufacture" (matches the document: certification
  covers black-tea manufacture from withering to sifting) rather than "certified factory". The About page states
  that tea-bagging is a separate step outside that certification.
- **Approved-copy edits.** The document's topic title "Strong or Premium BOPF Which Is Right for Me" is shown as
  "Strong or Premium BOPF — which is right for me?" (punctuation only). "25 tea bags x 1.8 g" keeps the
  document's "x". Taglines "Rich and Bold Simply Brewed" are shown as "Rich and Bold, Simply Brewed".
- **Delivery.** No fee or delivery area was specified. `DELIVERY_FEE_LKR` is empty, so the cart/checkout say
  "Confirmed by our team" and orders are saved with a delivery fee of 0. Set the env var to charge a flat fee.
- **Order "What happens next"** steps on the confirmation page and the contact-form success messages are
  assumed wording; no response times are promised. Please review.
- **Contact details.** Hotline +94 71 77 45 777 and website are from the pack. Email and WhatsApp are not
  confirmed → hidden until `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_WHATSAPP_NUMBER` are set. No opening hours,
  reply times, map or street-level factory address are shown (only "Nakiyadeniya, Galle district").
- **Factory-visit copy** uses "planned from November 2026" exactly as documented.
- **Business supply.** No minimum order quantity or pricing is stated; enquiries go to the `inquiries` table.
- **Claims deliberately omitted** (not in the documents): awards, farmer/garden-ownership stories, health claims,
  brand comparisons, sustainability or solar-power claims, certification marks.
- **Sinhala/Tamil:** only the pack's own line "තේ · TEA · தேயிலை" is used. No new translations.
  `lang="en"` and all copy in `src/content/` keep `next-intl` easy to add later.

## D. Assumptions I made (all configurable)

- Max quantity per cart line: **20** (`shopConfig.maxQtyPerLine`).
- Prices are stored in **minor units** (Rs. 320.00 → 32000). Display format "Rs. 320.00".
- Phone numbers are validated as Sri Lankan (+94 / 0-prefixed, 9 digits after the prefix) and stored as `+94XXXXXXXXX`.
- Order numbers come from a Postgres sequence: `SMR-000001`, `SMR-000002`, … (concurrency-safe).
- The public confirmation page shows items and totals only — **no name, phone, email or address**, because order
  numbers are sequential and guessable.
- Unavailable/removed products in a cart are flagged and block checkout until removed; the server re-checks
  everything (active, not business-only, has a price, in stock).
- Contact form limit: **5 submissions per IP per hour** (hashed IP, counted from `inquiries`); minimum fill time 3 s.
- `db:seed` never overwrites price, stock or active flags on existing rows.
- Catalogue cache: 60 s (`unstable_cache`, tag `products`); product pages are ISR with the same interval.
- No cookie banner: the site sets no cookies (cart uses localStorage `samrin_cart_v1`, disclosed in the privacy policy).
- Experimental `experimental.inlineCss` is on (≈10 KB CSS inlined for faster first paint). Remove it from
  `next.config.ts` if it ever causes trouble.
- Reveal-on-scroll uses CSS scroll-driven animation only where supported and honours `prefers-reduced-motion`.
- `AGENTS.md` / `CLAUDE.md` come from the Next.js scaffold (they point coding agents at the bundled docs); keep or delete.

## E. Not built (out of scope, hooks left)

Payment gateway (interface + stub webhook ready) · customer accounts · admin dashboard (use Drizzle Studio) ·
transactional emails (no order or enquiry emails are sent — someone must watch Studio or add an email step) ·
inventory management · deployment · analytics · blog · CAPTCHA (`verifyCaptcha` hook) · Content-Security-Policy header.

## F. QA results (local, production build, headless Chrome)

- End-to-end verified: add to cart → cart → checkout (client and server validation) → order saved with
  server-side totals → confirmation → cart cleared; double submit / concurrent replay with the same key created
  a single order; tampered requests (business-only product, unknown id, qty 99) were rejected.
- Contact/sample/business enquiries saved; honeypot, tampered token, too-fast submit and rate limit all verified.
- Automated sweep of 12 URLs (all routes incl. filtered shop, catering product, success page, 404) at **390 / 768 / 1280 / 1536 px**: no horizontal
  scroll, exactly one `<h1>` per page, alt text on every image, no console errors (the intentional 404 aside). One overflow bug found
  (catering CTA button on phones) and fixed. `npm run typecheck`, `lint`, `build` pass.
- **Lighthouse (mobile, simulated throttling, this dev machine), after the redesign:** Accessibility 97–100 (one contrast issue on the home
  page was fixed afterwards), Best Practices 100, SEO 100 (cart/checkout intentionally `noindex` → 69). Performance was **70–81** on the
  pages re-measured (home, shop, product, about, contact); scores vary a lot run to run on this machine. Target ≥ 90 is **not met**; the home page is
  heaviest because of the scroll-linked sections and web fonts. Observed (unthrottled) LCP is about 1 s or less.
- Not tested: real Neon, real pack images, Safari/Firefox, screen readers. Visual review was done at 390 and 1280 px; 768 and 1536 px were
  checked only by the automated sweep above.
