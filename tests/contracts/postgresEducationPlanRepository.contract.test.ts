import test from "node:test";
import { createOrganizationContext } from "../../src/application/context/OrganizationContext";
import { createPostgresEducationPlanRepository } from "../../src/infrastructure/repositories/database/postgresEducationPlanRepository";
import { runEducationPlanRepositoryContractTests } from "./runEducationPlanRepositoryContractTests";
import {
  createIsolatedPostgresSchema,
  createSchemaScopedPool,
  hasTestDatabase,
} from "../integration/fixtures/postgresTestDatabase";
import {
  createEducationPlanReferenceSchema,
  seedEducationPlanReferenceData,
} from "../integration/fixtures/seedEducationPlanReferenceAggregate";

if (!hasTestDatabase()) {
  test("postgres education plan repository contract tests skipped without TEST_DATABASE_URL", {
    skip: true,
  }, () => {});
} else {
  const setup = (async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createEducationPlanReferenceSchema(pool);
      await seedEducationPlanReferenceData(pool);

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

  runEducationPlanRepositoryContractTests("postgres education plan repository contract", {
    createForOrganization: async (organizationId) => {
      const state = await setup;

      return createPostgresEducationPlanRepository({
        organizationContext: createOrganizationContext(organizationId),
        pool: state.pool,
      });
    },
  });
}