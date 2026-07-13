import type { EducationPlanRepository } from "../../../domains/educationPlan/repositories/EducationPlanRepository";

export interface EducationPlanUnitOfWorkRepositories {
  educationPlanRepository: EducationPlanRepository;
}

export interface EducationPlanUnitOfWork {
  execute<T>(
    operation: (repositories: EducationPlanUnitOfWorkRepositories) => Promise<T>,
  ): Promise<T>;
}