# SAMRIN Tea — online store

Minimal, modern, mobile-first store for SAMRIN Tea (pure Ceylon black tea from Ruhuna, Sri Lanka).
Next.js 16 (App Router, TypeScript strict) · Tailwind CSS v4 · Neon Postgres + Drizzle ORM · Zod.

Runs locally only for now. See [OPEN_ITEMS.md](OPEN_ITEMS.md) for assumptions, missing assets and
items that need client confirmation.

## Prerequisites

- Node.js 20.9 or newer (developed on 20.15) and npm
- A [Neon](https://neon.tech) project (free tier is fine) — or use the offline local database below

## 1. Create the Neon project and a dev branch

1. Create a Neon project, then create a **`dev` branch** (Branches → New branch).
2. On the branch, open **Connect** and copy the **pooled** connection string (the host contains
   `-pooler`). It looks like `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`.

## 2. Configure the environment

```bash
cp .env.example .env.local
```

| Variable                      | Purpose                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Neon pooled connection string (required)                                         |
| `NEXT_PUBLIC_SITE_URL`        | Canonical URL for metadata/sitemap (default `http://localhost:3000`)             |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Optional. Contact row is hidden when empty                                       |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional, digits with country code. Row hidden when empty                        |
| `DELIVERY_FEE_LKR`            | Optional, e.g. `350`. Empty = no fee charged, "confirmed by our team"            |
| `PAYMENT_PROVIDER`            | Payment provider id, default `manual`                                            |
| `FORM_SECRET`                 | Optional secret for anti-spam form tokens (defaults to a hash of `DATABASE_URL`) |

Missing or malformed values produce a clear developer error (`src/lib/env.ts`).

## 3. Run it

```bash
npm install
npm run db:migrate && npm run db:seed && npm run dev
```

Open <http://localhost:3000>. `db:migrate` and `db:seed` are idempotent — run them as often as you like.
(`db:seed` refreshes product copy but never overwrites price, stock or active flags you have edited.)

### No Neon yet? Use the offline database

```bash
npm run db:local          # starts an embedded Postgres on :54329 (keep it running)
```

then set `DATABASE_URL=postgres://postgres:password@localhost:54329/samrin`. A `localhost` URL
automatically uses the plain `pg` driver; any other URL uses Neon's WebSocket driver (which, unlike
`neon-http`, supports the interactive transaction that order creation needs).

## Scripts

| Script                    | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Dev server                                                     |
| `npm run build` / `start` | Production build / server                                      |
| `npm run typecheck`       | `next typegen` + `tsc --noEmit`                                |
| `npm run lint`            | ESLint                                                         |
| `npm run format`          | Prettier                                                       |
| `npm run db:generate`     | Generate a Drizzle migration after editing `src/db/schema.ts`  |
| `npm run db:migrate`      | Apply migrations to `DATABASE_URL`                             |
| `npm run db:seed`         | Upsert the 5 products                                          |
| `npm run db:studio`       | Drizzle Studio (view orders, inquiries, edit prices)           |
| `npm run assets:products` | Crop real pack images from `/reference` (or draw placeholders) |

## Project structure

```
reference/                client source files (large binaries git-ignored)
public/brand/             logo SVG/PNG variants (from the approved EPS)
public/images/            products/, brew/ (approved artwork), about/
scripts/                  db-migrate, db-local, asset builders
drizzle/                  SQL migrations
src/app/                  routes: /, shop, shop/[slug], cart, checkout, checkout/success/[order],
                          about, contact, privacy-policy, api/payments/webhook, sitemap, robots
src/components/           ui/ layout/ product/ cart/ forms/ sections/ seo/
src/content/              copy that lives in code: reasons.ts (approved topics), faq.ts, privacy.tsx
src/db/                   schema.ts, index.ts (driver), seed.ts, seed-data.ts
src/lib/                  env, site-config, format, districts, cart/, payments/, validators/,
                          data/ (cached catalogue, orders), form-guard, rate-limit
```

Design tokens (colours from the brand guide, fonts) live in `src/app/globals.css` under `@theme`.
Burgundy (`strong`) is used **only** to identify the Strong range.

## Admin dashboard (WooCommerce-style)

Open <http://localhost:3000/admin> and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local` (leave them empty to switch the admin off).

| Section   | What you can do                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard | Sales total, order counts, new enquiries, recent orders                                                                               |
| Orders    | Search and filter, view items/customer/address, change order status, payment status, payment reference and internal notes, export CSV |
| Products  | Add, edit, hide, mark out of stock, delete. Every product field, the "Product details" rows, sort order, and **image upload**         |
| Customers | One row per email, built from orders                                                                                                  |
| Enquiries | Contact-form messages, filter by type/status, mark handled                                                                            |
| Settings  | Flat delivery fee, contact email and WhatsApp number (override the env values)                                                        |

**Product images.** Drag files onto the image box or choose files (JPG, PNG or WebP, up to 6 MB). The server checks the real file
content, resizes to at most 1600 px, converts to WebP, strips metadata and saves it to `./uploads/products/<id>.webp`
(git-ignored; override with `UPLOAD_DIR`). It is served by `/uploads/...`. The first image is the main one. Removing an image or deleting a
product deletes the file. To use cloud storage later, replace `saveProductImage` / `removeUploadedImage` in `src/lib/admin/storage.ts`.

**Security.** One admin, credentials from env (compared in constant time). Signed, expiring, HttpOnly session cookie. 5 failed logins per
15 minutes per client are throttled. Every admin page, server action and API route re-checks the session (`requireAdmin()`), the upload
route also checks the request origin, and CSV cells are protected against spreadsheet formula injection. `/admin` is `noindex` and disallowed in robots.txt.

## Light and dark mode

A sun/moon button in the header switches themes. The choice is saved in `localStorage` (`samrin_theme`); on a first visit the site follows the
device setting and falls back to dark. An inline script in `src/app/layout.tsx` applies it before paint, so there is no flash.

Components use **semantic tokens** (`bg-surface`, `bg-surface-2`, `text-ink`, `text-heading`, `text-muted`, `border-line`, `text-gold-ink`, `bg-btn`) whose
values flip under `:root[data-theme="dark"]` in `src/app/globals.css`. Use `dark:` utilities only for one-off differences. Panels that look the same in both
modes (burgundy/green "choose" cards, the business card, toasts) use the raw palette (`bg-forest`, `text-paper`) on purpose. The logo follows the theme
(`<Logo />`: full colour in light mode, reversed in dark mode).

## How to add photos

Photo slots (Origin tile, the four Making cards, the three Story tiles) show the design's texture until you fill them:

1. Copy the photo into `public/images/site/` (JPG or WebP, about 2000 px on the long edge; Next.js resizes it for each screen).
2. Open `src/content/site-images.ts` and replace the slot's `null` with `{ src, alt, width, height }`. Write real alt text.
3. Photos that need a credit (Creative Commons etc.) get `credit: { text, href }` and are listed automatically under "Photo credits" on the Story page.

Product pack images are separate: see `npm run assets:products` and "How to add a product". Use authentic Samrin photography only.

## How to add a product

1. Add the pack image as `public/images/products/<slug>.webp` (or extend `scripts/build-product-images.mjs`).
2. Add an entry to `src/db/seed-data.ts` (copy, details rows, price in **minor units**: Rs. 320.00 → `32000`).
3. `npm run db:seed`. The catalogue is cached for 60 s; it appears on the shop, sitemap and product page.

Or insert a row in Drizzle Studio (`npm run db:studio`). A `null` price + `is_business_only` gives the
"Request business pricing" flow instead of a cart button. Change a price or flip `in_stock`/`is_active`
in Studio at any time — no code change needed.

## How to plug in a payment gateway

The seam is `src/lib/payments/types.ts` (`PaymentProvider`). Today only the **manual** provider exists:
orders are saved `status=pending`, `payment_status=unpaid`, `payment_provider=manual`.

1. Create `src/lib/payments/<gateway>.ts` implementing `createPayment(order)` (return a `redirectUrl`
   for redirect gateways, or a `reference`), `handleWebhook(request)` (verify signature, update
   `orders.payment_status`) and `mapStatus(raw)`.
2. Register it in `src/lib/payments/index.ts` and set `PAYMENT_PROVIDER=<gateway>`.
3. `placeOrder` (`src/app/checkout/actions.ts`) already calls `createPayment` after the order is stored
   and redirects to `redirectUrl` when one is returned. The stub route `POST /api/payments/webhook`
   delegates to the active provider (returns `501` for manual).

## Security and spam protection

- All input is validated server-side with Zod (schemas in `src/lib/validators/` are shared with the client).
- Prices are never trusted from the browser: `placeOrder` reads only product ids and quantities, then
  recalculates from the database inside one transaction. Orders carry an idempotency key (double submit is safe).
- Contact form: honeypot field, signed minimum-fill-time token, and a durable per-IP limit
  (5/hour, counted from the `inquiries` table). `verifyCaptcha()` in `src/lib/form-guard.ts` is the hook for Cloudflare Turnstile.
- Security headers are set in `next.config.ts`. `.env*` is git-ignored (except `.env.example`).

## Git

Trunk-style history on `main` with Conventional Commits. Nothing has been pushed. To publish:

```bash
git remote add origin <URL>
git push -u origin main
```
