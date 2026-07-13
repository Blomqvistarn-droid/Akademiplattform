import assert from "node:assert/strict";
import test from "node:test";
import { PostgresTransactionRunner } from "../../src/infrastructure/transactions/PostgresTransactionRunner";
import {
  createSchemaScopedPool,
  hasTestDatabase,
  withIsolatedPostgresSchema,
} from "./fixtures/postgresTestDatabase";
import { queryWithTransactionClient } from "../../src/infrastructure/persistence/postgres/postgresTransactionContext";

test("postgres transaction runner: uses same connection for queries within a transaction", async () => {
  if (!hasTestDatabase()) {
    return;
  }

  await withIsolatedPostgresSchema(async (db) => {
    const pool = createSchemaScopedPool(db);
    const runner = new PostgresTransactionRunner(pool);

    try {
      const pids = await runner.executeInTransaction(async () => {
        const firstResult = await queryWithTransactionClient<{ pid: number }>(
          pool,
          "SELECT pg_backend_pid() AS pid",
        );
        const secondResult = await queryWithTransactionClient<{ pid: number }>(
          pool,
          "SELECT pg_backend_pid() AS pid",
        );

        return [firstResult.rows[0].pid, secondResult.rows[0].pid] as const;
      });

      assert.equal(pids[0], pids[1]);
    } finally {
      await pool.end();
    }
  });
});
