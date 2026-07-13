import assert from "node:assert/strict";
import test from "node:test";
import { GET as listTrainings, POST as createTraining } from "../../src/app/api/trainings/route";
import {
  DELETE as archiveTraining,
  GET as getTraining,
  PUT as updateTraining,
} from "../../src/app/api/trainings/[id]/route";
import { closePostgresPool } from "../../src/infrastructure/persistence/postgres/postgresPool";
import {
  createIsolatedPostgresSchema,
  hasTestDatabase,
} from "./fixtures/postgresTestDatabase";
import {
  createTrainingReferenceSchema,
  seedTrainingReferenceData,
} from "./fixtures/seedTrainingReferenceAggregate";

function buildSchemaScopedConnectionString(
  connectionString: string,
  schemaName: string,
): string {
  const separator = connectionString.includes("?") ? "&" : "?";
  return `${connectionString}${separator}options=${encodeURIComponent(
    `-c search_path=${schemaName},public`,
  )}`;
}

if (!hasTestDatabase()) {
  test("trainings api integration skipped without TEST_DATABASE_URL", { skip: true }, () => {});
} else {
  test("trainings api: complete CRUD/archive vertical flow with organization isolation", async () => {
    const db = await createIsolatedPostgresSchema();

    const previousDatabaseUrl = process.env.DATABASE_URL;
    const previousProvider = process.env.REPOSITORY_PROVIDER;

    process.env.DATABASE_URL = buildSchemaScopedConnectionString(
      db.connectionString,
      db.schemaName,
    );
    process.env.REPOSITORY_PROVIDER = "database";

    try {
      const setupPoolModule = await import("pg");
      const setupPool = new setupPoolModule.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1,
      });

      await createTrainingReferenceSchema(setupPool);
      await seedTrainingReferenceData(setupPool);
      await setupPool.end();
      await closePostgresPool();

      const headersOrg1 = new Headers({ "x-organization-id": "00000000-0000-0000-0000-000000000001", "content-type": "application/json" });
      const headersOrg2 = new Headers({ "x-organization-id": "00000000-0000-0000-0000-000000000002", "content-type": "application/json" });

      const createResponse = await createTraining(
        new Request("http://localhost/api/trainings", {
          method: "POST",
          headers: headersOrg1,
          body: JSON.stringify({
            teamId: "00000000-0000-0000-0000-000000000101",
            sessionTemplateId: "session-winger-3",
            scheduledAt: "2026-08-21T17:00:00.000Z",
          }),
        }),
      );

      assert.equal(createResponse.status, 201);
      const created = (await createResponse.json()) as { id: string };

      const listResponse = await listTrainings(
        new Request("http://localhost/api/trainings", {
          method: "GET",
          headers: headersOrg1,
        }),
      );
      assert.equal(listResponse.status, 200);
      const listed = (await listResponse.json()) as Array<{ id: string }>;
      assert.ok(listed.some((item) => item.id === created.id));

      const getResponse = await getTraining(
        new Request(`http://localhost/api/trainings/${created.id}`, {
          method: "GET",
          headers: headersOrg1,
        }),
        { params: { id: created.id } },
      );
      assert.equal(getResponse.status, 200);

      const updateResponse = await updateTraining(
        new Request(`http://localhost/api/trainings/${created.id}`, {
          method: "PUT",
          headers: headersOrg1,
          body: JSON.stringify({ status: "completed" }),
        }),
        { params: { id: created.id } },
      );
      assert.equal(updateResponse.status, 200);

      const deleteResponse = await archiveTraining(
        new Request(`http://localhost/api/trainings/${created.id}`, {
          method: "DELETE",
          headers: headersOrg1,
        }),
        { params: { id: created.id } },
      );
      assert.equal(deleteResponse.status, 200);

      const crossOrgGetResponse = await getTraining(
        new Request(`http://localhost/api/trainings/${created.id}`, {
          method: "GET",
          headers: headersOrg2,
        }),
        { params: { id: created.id } },
      );
      assert.equal(crossOrgGetResponse.status, 404);
    } finally {
      await closePostgresPool();
      process.env.DATABASE_URL = previousDatabaseUrl;
      process.env.REPOSITORY_PROVIDER = previousProvider;
      await db.dispose();
    }
  });
}
