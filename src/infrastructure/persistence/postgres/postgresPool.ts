import { Pool } from "pg";
import {
  readPostgresConfig,
  type PostgresConfig,
} from "./postgresConfig";

let sharedPool: Pool | null = null;

function createPool(config: PostgresConfig): Pool {
  return new Pool({
    connectionString: config.connectionString,
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeoutMs,
    connectionTimeoutMillis: config.connectionTimeoutMs,
  });
}

export function getPostgresPool(
  env: NodeJS.ProcessEnv = process.env,
): Pool {
  if (!sharedPool) {
    sharedPool = createPool(readPostgresConfig(env));
  }

  return sharedPool;
}

export async function closePostgresPool(): Promise<void> {
  if (!sharedPool) {
    return;
  }

  const current = sharedPool;
  sharedPool = null;
  await current.end();
}
