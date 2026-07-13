import type { TransactionRunner } from "@/application/transactions/TransactionRunner";
import { runWithTransactionClient } from "../persistence/postgres/postgresTransactionContext";
import type { Pool } from "pg";

export class PostgresTransactionRunner implements TransactionRunner {
  constructor(private readonly pool: Pool) {}

  async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await runWithTransactionClient(client, operation);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
