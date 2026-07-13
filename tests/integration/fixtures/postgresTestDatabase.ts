import { randomUUID } from "node:crypto";
import { Client, Pool } from "pg";

export interface PostgresTestDatabase {
  connectionString: string;
  schemaName: string;
}

export interface ManagedPostgresTestDatabase extends PostgresTestDatabase {
  dispose(): Promise<void>;
}

export function hasTestDatabase(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(env.TEST_DATABASE_URL ?? env.DATABASE_URL);
}

export function readTestDatabaseConnectionString(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const connectionString = env.TEST_DATABASE_URL ?? env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing TEST_DATABASE_URL (or DATABASE_URL fallback) for integration tests.",
    );
  }

  return connectionString;
}

export async function withIsolatedPostgresSchema<T>(
  run: (db: PostgresTestDatabase) => Promise<T>,
  env: NodeJS.ProcessEnv = process.env,
): Promise<T> {
  const db = await createIsolatedPostgresSchema(env);

  try {
    return await run(db);
  } finally {
    await db.dispose();
  }
}

export async function createIsolatedPostgresSchema(
  env: NodeJS.ProcessEnv = process.env,
): Promise<ManagedPostgresTestDatabase> {
  const connectionString = readTestDatabaseConnectionString(env);
  const schemaName = `test_${randomUUID().replace(/-/g, "")}`;
  const client = new Client({ connectionString });

  await client.connect();
  await client.query(`CREATE SCHEMA ${schemaName}`);

  return {
    connectionString,
    schemaName,
    dispose: async () => {
      await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
      await client.end();
    },
  };
}

export function createSchemaScopedPool(db: PostgresTestDatabase): Pool {
  return new Pool({
    connectionString: db.connectionString,
    options: `-c search_path=${db.schemaName},public`,
    max: 1,
  });
}
