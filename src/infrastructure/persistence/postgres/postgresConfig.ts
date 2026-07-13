export interface PostgresConfig {
  connectionString: string;
  maxConnections: number;
  idleTimeoutMs: number;
  connectionTimeoutMs: number;
}

export function readPostgresConfig(
  env: NodeJS.ProcessEnv = process.env,
): PostgresConfig {
  const connectionString = env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL for PostgreSQL provider.");
  }

  return {
    connectionString,
    maxConnections: Number(env.DB_POOL_MAX ?? "10"),
    idleTimeoutMs: Number(env.DB_IDLE_TIMEOUT_MS ?? "30000"),
    connectionTimeoutMs: Number(env.DB_CONNECTION_TIMEOUT_MS ?? "5000"),
  };
}
