import "./_env";
import { migrate as migrateNeon } from "drizzle-orm/neon-serverless/migrator";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { getDb, isLocalDatabaseUrl } from "@/db";
import { getServerEnv } from "@/lib/env";

/** Applies ./drizzle migrations. Safe to re-run: applied migrations are tracked and skipped. */
async function main() {
  const { DATABASE_URL } = getServerEnv();
  const db = getDb();
  if (isLocalDatabaseUrl(DATABASE_URL)) {
    // The local driver is node-postgres; the migrator only needs the shared query API.
    await migratePg(db as unknown as Parameters<typeof migratePg>[0], {
      migrationsFolder: "./drizzle",
    });
  } else {
    await migrateNeon(db, { migrationsFolder: "./drizzle" });
  }
  console.log("Migrations applied.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
