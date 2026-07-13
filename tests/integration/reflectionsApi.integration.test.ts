import assert from "node:assert/strict";
import test from "node:test";
import { GET as listReflections, POST as createReflection } from "../../src/app/api/reflections/route";
import { GET as getReflection } from "../../src/app/api/reflections/[id]/route";
import { GET as getRecommendation } from "../../src/app/api/reflections/recommendation/route";
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
  test("reflections api integration skipped without TEST_DATABASE_URL", { skip: true }, () => {});
} else {
  test("reflections api: create/list/get/recommendation with organization isolation", async () => {
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
      await setupPool.query(`
        DELETE FROM session_reflection
        WHERE organization_id = '00000000-0000-0000-0000-000000000001'
          AND scheduled_session_id = '00000000-0000-0000-0000-000000001002'
      `);
      await setupPool.end();
      await closePostgresPool();

      const headersOrg1 = new Headers({ "x-organization-id": "00000000-0000-0000-0000-000000000001", "content-type": "application/json" });
      const headersOrg2 = new Headers({ "x-organization-id": "00000000-0000-0000-0000-000000000002", "content-type": "application/json" });

      const createResponse = await createReflection(
        new Request("http://localhost/api/reflections", {
          method: "POST",
          headers: headersOrg1,
          body: JSON.stringify({
            scheduledSessionId: "00000000-0000-0000-0000-000000001002",
            authorId: "00000000-0000-0000-0000-000000000201",
            understandingScore: 5,
            independenceScore: 4,
            notes: "Bra progression idag.",
          }),
        }),
      );

      assert.equal(createResponse.status, 201);
      const created = (await createResponse.json()) as {
        reflection: { id: string };
        recommendation: { type: string };
      };

      assert.equal(created.recommendation.type, "advance");

      const getResponse = await getReflection(
        new Request(`http://localhost/api/reflections/${created.reflection.id}`, {
          method: "GET",
          headers: headersOrg1,
        }),
        { params: { id: created.reflection.id } },
      );
      assert.equal(getResponse.status, 200);

      const listResponse = await listReflections(
        new Request("http://localhost/api/reflections", {
          method: "GET",
          headers: headersOrg1,
        }),
      );
      assert.equal(listResponse.status, 200);
      const listed = (await listResponse.json()) as Array<{ id: string }>;
      assert.ok(listed.some((item) => item.id === created.reflection.id));

      const recommendationResponse = await getRecommendation(
        new Request("http://localhost/api/reflections/recommendation?scheduledSessionId=00000000-0000-0000-0000-000000001002", {
          method: "GET",
          headers: headersOrg1,
        }),
      );
      assert.equal(recommendationResponse.status, 200);
      const recommendation = (await recommendationResponse.json()) as {
        evidence: { scheduledSessionId: string; reflectionCount: number };
        isFallback: boolean;
      };
      assert.equal(recommendation.evidence.scheduledSessionId, "00000000-0000-0000-0000-000000001002");
      assert.ok(recommendation.evidence.reflectionCount >= 1);
      assert.equal(recommendation.isFallback, false);

      const fallbackRecommendationResponse = await getRecommendation(
        new Request("http://localhost/api/reflections/recommendation?scheduledSessionId=00000000-0000-0000-0000-000000001001", {
          method: "GET",
          headers: headersOrg1,
        }),
      );
      assert.equal(fallbackRecommendationResponse.status, 200);
      const fallbackRecommendation = (await fallbackRecommendationResponse.json()) as {
        isFallback: boolean;
        fallbackReason: string | null;
      };
      assert.equal(fallbackRecommendation.isFallback, true);
      assert.ok(fallbackRecommendation.fallbackReason);

      const invalidScoreResponse = await createReflection(
        new Request("http://localhost/api/reflections", {
          method: "POST",
          headers: headersOrg1,
          body: JSON.stringify({
            scheduledSessionId: "00000000-0000-0000-0000-000000001002",
            authorId: "00000000-0000-0000-0000-000000000201",
            understandingScore: 7,
            independenceScore: 2,
            notes: "Ogiltig score.",
          }),
        }),
      );
      assert.equal(invalidScoreResponse.status, 400);

      const duplicateResponse = await createReflection(
        new Request("http://localhost/api/reflections", {
          method: "POST",
          headers: headersOrg1,
          body: JSON.stringify({
            scheduledSessionId: "00000000-0000-0000-0000-000000001002",
            authorId: "00000000-0000-0000-0000-000000000201",
            understandingScore: 4,
            independenceScore: 4,
            notes: "Dublettforsok.",
          }),
        }),
      );
      assert.equal(duplicateResponse.status, 409);

      const plannedSessionResponse = await createReflection(
        new Request("http://localhost/api/reflections", {
          method: "POST",
          headers: headersOrg1,
          body: JSON.stringify({
            scheduledSessionId: "00000000-0000-0000-0000-000000001001",
            authorId: "00000000-0000-0000-0000-000000000201",
            understandingScore: 4,
            independenceScore: 3,
            notes: "Ej avslutat pass.",
          }),
        }),
      );
      assert.equal(plannedSessionResponse.status, 422);

      const crossOrgGetResponse = await getReflection(
        new Request(`http://localhost/api/reflections/${created.reflection.id}`, {
          method: "GET",
          headers: headersOrg2,
        }),
        { params: { id: created.reflection.id } },
      );
      assert.equal(crossOrgGetResponse.status, 404);

      const missingHeaderResponse = await listReflections(
        new Request("http://localhost/api/reflections", {
          method: "GET",
        }),
      );
      assert.equal(missingHeaderResponse.status, 400);
    } finally {
      await closePostgresPool();
      process.env.DATABASE_URL = previousDatabaseUrl;
      process.env.REPOSITORY_PROVIDER = previousProvider;
      await db.dispose();
    }
  });
}
