/**
 * Optional offline Postgres for development (no Neon needed):
 *   npm run db:local          # keeps running; Ctrl+C to stop
 *   DATABASE_URL=postgres://postgres:password@localhost:54329/samrin
 * Data lives in ./.local-pg (git-ignored).
 */
import { existsSync } from "node:fs";
import EmbeddedPostgres from "embedded-postgres";

const PORT = 54329;
const DIR = "./.local-pg/data";

async function main() {
  const server = new EmbeddedPostgres({
    databaseDir: DIR,
    user: "postgres",
    password: "password",
    port: PORT,
    persistent: true,
  });
  if (!existsSync(`${DIR}/PG_VERSION`)) await server.initialise();
  await server.start();
  try {
    await server.createDatabase("samrin");
  } catch {
    // already exists
  }
  console.log(`\nLocal Postgres ready:\n  postgres://postgres:password@localhost:${PORT}/samrin\n`);

  const stop = async () => {
    await server.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  setInterval(() => undefined, 1 << 30);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
