import test from "node:test";
import type { Pool } from "pg";
import { createOrganizationContext } from "../../src/application/context/OrganizationContext";
import { createPostgresTrainingRepository } from "../../src/infrastructure/repositories/database/postgresTrainingRepository";
import { runTrainingRepositoryContractTests } from "./runTrainingRepositoryContractTests";
import {
  createIsolatedPostgresSchema,
  createSchemaScopedPool,
  hasTestDatabase,
} from "../integration/fixtures/postgresTestDatabase";
import {
  createTrainingReferenceSchema,
  seedTrainingReferenceData,
} from "../integration/fixtures/seedTrainingReferenceAggregate";

if (!hasTestDatabase()) {
  test("postgres training repository contract tests skipped without TEST_DATABASE_URL", {
    skip: true,
  }, () => {});
} else {
  const setup = (async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);
      await seedTrainingReferenceData(pool);

      return {
        pool,
        dispose: async () => {
          await pool.end();
          await db.dispose();
        },
      };
    } catch (error) {
      await pool.end();
      await db.dispose();
      throw error;
    }
  })();

  test.after(async () => {
    const state = await setup;
    await state.dispose();
  });

  runTrainingRepositoryContractTests("postgres training repository", {
    createForOrganization: async (organizationId) => {
      const state = await setup;

      return createPostgresTrainingRepository({
        organizationContext: createOrganizationContext(organizationId),
        pool: state.pool,
      });
    },
  });
}
