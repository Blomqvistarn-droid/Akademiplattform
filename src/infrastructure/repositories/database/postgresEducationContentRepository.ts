import type { OrganizationContext } from "../../../application/context/OrganizationContext";
import type { EducationContentRepository } from "../../../domains/academy/repositories/EducationContentRepository";
import { localEducationContentRepository } from "../local/localEducationContentRepository";
import type { Pool } from "pg";

export interface PostgresEducationContentRepositoryOptions {
  organizationContext: OrganizationContext;
  pool: Pool;
}

export function createPostgresEducationContentRepository(
  _options: PostgresEducationContentRepositoryOptions,
): EducationContentRepository {
  // Academy content is still sourced from the validated in-repo content model.
  // This keeps provider wiring stable while training aggregate uses PostgreSQL.
  return localEducationContentRepository;
}
