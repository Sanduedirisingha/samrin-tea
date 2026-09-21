import "../../scripts/_env";
import { sql } from "drizzle-orm";
import { getDb } from "./index";
import { seedProducts } from "./seed-data";
import { products } from "./schema";

/**
 * Idempotent: upserts by slug. Content fields are refreshed from seed-data.ts; operational
 * fields (price, stock, active flag, sort order) are left alone on existing rows so edits made
 * in Drizzle Studio survive a re-seed.
 */
async function main() {
  const db = getDb();
  for (const p of seedProducts) {
    await db
      .insert(products)
      .values(p)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: p.name,
          range: p.range,
          format: p.format,
          packLabel: p.packLabel,
          netWeightG: p.netWeightG,
          unitsPerPack: p.unitsPerPack,
          tagline: p.tagline,
          shortDescription: p.shortDescription,
          description: p.description,
          chooseThisIf: p.chooseThisIf,
          details: p.details,
          images: p.images,
          isBusinessOnly: p.isBusinessOnly,
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`Seeded ${seedProducts.length} products.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
