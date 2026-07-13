import { AsyncLocalStorage } from "node:async_hooks";
import type { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

const transactionClientStorage = new AsyncLocalStorage<PoolClient>();

export async function runWithTransactionClient<T>(
  client: PoolClient,
  operation: () => Promise<T>,
): Promise<T> {
  return transactionClientStorage.run(client, operation);
}

export async function queryWithTransactionClient<
  Row extends QueryResultRow = QueryResultRow,
>(
  pool: Pool,
  text: string,
  values?: readonly unknown[],
): Promise<QueryResult<Row>> {
  const client = transactionClientStorage.getStore();

  if (client) {
    return client.query<Row>(text, values as unknown[] | undefined);
  }

  return pool.query<Row>(text, values as unknown[] | undefined);
}
