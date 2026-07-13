export interface TransactionRunner {
  executeInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}
