import type { OrganizationContext } from "../application/context/OrganizationContext";
import type { TransactionRunner } from "../application/transactions/TransactionRunner";
import type { EducationContentRepository } from "../domains/academy/repositories/EducationContentRepository";
import type { EducationPlanRepository } from "../domains/educationPlan/repositories/EducationPlanRepository";
import type { TrainingRepository } from "../domains/training/repositories/TrainingRepository";
import { readOrganizationContextFromEnv } from "../infrastructure/config/organizationContext";
import {
  readRepositoryProviderFromEnv,
  type RepositoryProvider,
} from "../infrastructure/config/repositoryProvider";
import {
  createPostgresEducationContentRepository,
} from "../infrastructure/repositories/database/postgresEducationContentRepository";
import {
  createPostgresEducationPlanRepository,
} from "../infrastructure/repositories/database/postgresEducationPlanRepository";
import { createPostgresTrainingRepository } from "../infrastructure/repositories/database/postgresTrainingRepository";
import { localEducationContentRepository } from "../infrastructure/repositories/local/localEducationContentRepository";
import { createLocalEducationPlanRepository } from "../infrastructure/repositories/local/localEducationPlanRepository";
import { createLocalTrainingRepository } from "../infrastructure/repositories/local/localTrainingRepository";
import { getPostgresPool } from "../infrastructure/persistence/postgres/postgresPool";
import { InMemoryTransactionRunner } from "../infrastructure/transactions/InMemoryTransactionRunner";
import { PostgresTransactionRunner } from "../infrastructure/transactions/PostgresTransactionRunner";

export interface RuntimeDependencies {
  provider: RepositoryProvider;
  organizationContext: OrganizationContext;
  educationContentRepository: EducationContentRepository;
  educationPlanRepository: EducationPlanRepository;
  trainingRepository: TrainingRepository;
  transactionRunner: TransactionRunner;
}

export function createRuntimeDependencies(
  env: NodeJS.ProcessEnv = process.env,
): RuntimeDependencies {
  const provider = readRepositoryProviderFromEnv(env);
  const organizationContext = readOrganizationContextFromEnv(env);

  if (provider === "local") {
    return {
      provider,
      organizationContext,
      educationContentRepository: localEducationContentRepository,
      educationPlanRepository: createLocalEducationPlanRepository(organizationContext),
      trainingRepository: createLocalTrainingRepository(organizationContext),
      transactionRunner: new InMemoryTransactionRunner(),
    };
  }

  if (provider === "database") {
    const pool = getPostgresPool(env);

    return {
      provider,
      organizationContext,
      educationContentRepository: createPostgresEducationContentRepository({
        organizationContext,
        pool,
      }),
      educationPlanRepository: createPostgresEducationPlanRepository({
        organizationContext,
        pool,
      }),
      trainingRepository: createPostgresTrainingRepository({
        organizationContext,
        pool,
      }),
      transactionRunner: new PostgresTransactionRunner(pool),
    };
  }

  throw new Error(`Unsupported repository provider: ${provider}`);
}
