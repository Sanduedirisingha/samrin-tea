import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import pg from "pg";
import ws from "ws";
import { getServerEnv } from "@/lib/env";
import * as schema from "./schema";

export type Database = NeonDatabase<typeof schema>;

/** A localhost URL means the optional offline dev Postgres (`npm run db:local`). */
export const isLocalDatabaseUrl = (url: string) => /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);

const globalForDb = globalThis as unknown as { __samrinDb?: Database };

/**
 * Neon (WebSocket Pool) is the real target: unlike neon-http it supports interactive
 * transactions, which order creation needs. Both drivers share the same drizzle pg API.
 */
function createDb(): Database {
  const { DATABASE_URL } = getServerEnv();
  if (isLocalDatabaseUrl(DATABASE_URL)) {
    const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 5 });
    return drizzlePg({ client: pool, schema }) as unknown as Database;
  }
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString: DATABASE_URL, max: 5 });
  return drizzleNeon({ client: pool, schema });
}

export function getDb(): Database {
  globalForDb.__samrinDb ??= createDb();
  return globalForDb.__samrinDb;
}
