import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { queryWithTransactionClient } from "../../src/infrastructure/persistence/postgres/postgresTransactionContext";
import { PostgresTransactionRunner } from "../../src/infrastructure/transactions/PostgresTransactionRunner";

interface QueryCall {
  text: string;
  values?: readonly unknown[];
}

class FakeClient {
  public calls: QueryCall[] = [];

  async query(text: string, values?: readonly unknown[]) {
    this.calls.push({ text, values });
    return { rowCount: 0, rows: [] };
  }

  release() {
    return;
  }
}

class FakePool {
  public calls: QueryCall[] = [];

  constructor(private readonly client: FakeClient) {}

  async connect() {
    return this.client;
  }

  async query(text: string, values?: readonly unknown[]) {
    this.calls.push({ text, values });
    return { rowCount: 0, rows: [] };
  }
}

test("postgres transaction runner routes transaction-aware queries to same client", async () => {
  const client = new FakeClient();
  const pool = new FakePool(client);
  const runner = new PostgresTransactionRunner(pool as unknown as Pool);

  await runner.executeInTransaction(async () => {
    await queryWithTransactionClient(pool as unknown as Pool, "SELECT 1");
    await queryWithTransactionClient(pool as unknown as Pool, "SELECT 2");
  });

  assert.equal(pool.calls.length, 0);
  assert.deepEqual(
    client.calls.map((call) => call.text),
    ["BEGIN", "SELECT 1", "SELECT 2", "COMMIT"],
  );
});
