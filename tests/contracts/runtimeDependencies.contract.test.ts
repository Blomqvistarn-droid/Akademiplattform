import assert from "node:assert/strict";
import test from "node:test";
import { createRuntimeDependencies } from "../../src/composition/createRuntimeDependencies";
import { closePostgresPool } from "../../src/infrastructure/persistence/postgres/postgresPool";

test("runtime dependencies: local provider uses local education plan repository", async () => {
  const dependencies = createRuntimeDependencies({
    REPOSITORY_PROVIDER: "local",
    ORGANIZATION_ID: "runtime-local-org",
  });

  const plans = await dependencies.educationPlanRepository.listEducationPlans();

  assert.equal(dependencies.provider, "local");
  assert.ok(Array.isArray(plans));
});

test("runtime dependencies: database provider fails fast when DATABASE_URL is missing", () => {
  assert.throws(
    () =>
      createRuntimeDependencies({
        REPOSITORY_PROVIDER: "database",
        ORGANIZATION_ID: "runtime-database-org",
      }),
    /Missing DATABASE_URL for PostgreSQL provider\./,
  );
});

test("runtime dependencies: database provider never falls back to local education plan repository", async () => {
  try {
    const dependencies = createRuntimeDependencies({
      REPOSITORY_PROVIDER: "database",
      ORGANIZATION_ID: "runtime-database-org",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/testdb",
    });

    assert.equal(dependencies.provider, "database");

    await assert.rejects(
      () => dependencies.educationPlanRepository.listEducationPlans(),
      (error: unknown) => error instanceof Error,
    );
  } finally {
    await closePostgresPool();
  }
});