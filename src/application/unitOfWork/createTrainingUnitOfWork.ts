import type { TransactionRunner } from "../transactions/TransactionRunner";
import type { TrainingRepository } from "../../domains/training/repositories/TrainingRepository";
import type {
  TrainingUnitOfWork,
  TrainingUnitOfWorkRepositories,
} from "./TrainingUnitOfWork";

interface CreateTrainingUnitOfWorkOptions {
  transactionRunner: TransactionRunner;
  trainingRepository: TrainingRepository;
}

export function createTrainingUnitOfWork(
  options: CreateTrainingUnitOfWorkOptions,
): TrainingUnitOfWork {
  const repositories: TrainingUnitOfWorkRepositories = {
    trainingRepository: options.trainingRepository,
  };

  return {
    execute: async (operation) =>
      options.transactionRunner.executeInTransaction(() => operation(repositories)),
  };
}
