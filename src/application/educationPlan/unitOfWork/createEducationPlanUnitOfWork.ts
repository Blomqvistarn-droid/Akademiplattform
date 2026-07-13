import type { TransactionRunner } from "../../transactions/TransactionRunner";
import type { EducationPlanRepository } from "../../../domains/educationPlan/repositories/EducationPlanRepository";
import type {
  EducationPlanUnitOfWork,
  EducationPlanUnitOfWorkRepositories,
} from "./EducationPlanUnitOfWork";

interface CreateEducationPlanUnitOfWorkOptions {
  transactionRunner: TransactionRunner;
  educationPlanRepository: EducationPlanRepository;
}

export function createEducationPlanUnitOfWork(
  options: CreateEducationPlanUnitOfWorkOptions,
): EducationPlanUnitOfWork {
  const repositories: EducationPlanUnitOfWorkRepositories = {
    educationPlanRepository: options.educationPlanRepository,
  };

  return {
    execute: async (operation) =>
      options.transactionRunner.executeInTransaction(() => operation(repositories)),
  };
}