import type { TrainingRepository } from "../../domains/training/repositories/TrainingRepository";

export interface TrainingUnitOfWorkRepositories {
  trainingRepository: TrainingRepository;
}

export interface TrainingUnitOfWork {
  execute<T>(
    operation: (repositories: TrainingUnitOfWorkRepositories) => Promise<T>,
  ): Promise<T>;
}
