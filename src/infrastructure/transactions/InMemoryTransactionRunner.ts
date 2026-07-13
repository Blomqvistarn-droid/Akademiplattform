import type { TransactionRunner } from "@/application/transactions/TransactionRunner";

export class InMemoryTransactionRunner implements TransactionRunner {
  async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}
