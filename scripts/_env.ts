// Import this first in any CLI script so .env.local / .env are loaded like Next.js does.
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
