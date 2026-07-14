import assert from "node:assert/strict";
import test from "node:test";
import { PUT as updateTraining } from "../../src/app/api/trainings/[id]/route";
import { POST as createReflection } from "../../src/app/api/reflections/route";
import { GET as getRecommendation } from "../../src/app/api/reflections/recommendation/route";
import { GET as getEducationPlan } from "../../src/app/api/education-plans/route";
import { POST as saveProgressEvent } from "../../src/app/api/education-plans/[id]/progress-events/route";
import { closePostgresPool } from "../../src/infrastructure/persistence/postgres/postgresPool";
import {
  createIsolatedPostgresSchema,
  hasTestDatabase,
} from "./fixtures/postgresTestDatabase";
import {
  createTrainingReferenceSchema,
  seedTrainingReferenceData,
} from "./fixtures/seedTrainingReferenceAggregate";
import {
  createEducationPlanTablesForCoachFlow,
  seedEducationPlanDataForCoachFlow,
} from "./fixtures/seedEducationPlanForCoachFlow";

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
  test("coach flow postgres integration skipped without TEST_DATABASE_URL", { skip: true }, () => {});
} else {
  test("coach flow postgres integration: completed -> reflection -> decision -> progress readback", async () => {
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
      await createEducationPlanTablesForCoachFlow(setupPool);
      await seedEducationPlanDataForCoachFlow(setupPool);
      await setupPool.end();
      await closePostgresPool();

      const organizationId = "00000000-0000-0000-0000-000000000001";
      const scheduledSessionId = "00000000-0000-0000-0000-000000001001";
      const educationPlanId = "00000000-0000-0000-0000-000000010001";

      const headers = new Headers({
        "x-organization-id": organizationId,
        "content-type": "application/json",
      });

      const completedResponse = await updateTraining(
        new Request(`http://localhost/api/trainings/${scheduledSessionId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: "completed" }),
        }),
        { params: { id: scheduledSessionId } },
      );

      assert.equal(completedResponse.status, 200);

      const reflectionResponse = await createReflection(
        new Request("http://localhost/api/reflections", {
          method: "POST",
          headers,
          body: JSON.stringify({
            scheduledSessionId,
            authorId: "00000000-0000-0000-0000-000000000201",
            understandingScore: 4,
            independenceScore: 4,
            notes: "Bra beslutsfattande i sista tredjedelen.",
          }),
        }),
      );

      assert.equal(reflectionResponse.status, 201);
      const reflectionPayload = (await reflectionResponse.json()) as {
        recommendation: { type: "repeat" | "simplify" | "progress" | "advance" };
      };

      const recommendationResponse = await getRecommendation(
        new Request(
          `http://localhost/api/reflections/recommendation?scheduledSessionId=${scheduledSessionId}`,
          {
            method: "GET",
            headers,
          },
        ),
      );
      assert.equal(recommendationResponse.status, 200);
      const recommendationPayload = (await recommendationResponse.json()) as {
        type: "repeat" | "simplify" | "progress" | "advance";
        isFallback: boolean;
        evidence: { scheduledSessionId: string; reflectionCount: number };
      };
      assert.equal(recommendationPayload.isFallback, false);
      assert.equal(recommendationPayload.evidence.scheduledSessionId, scheduledSessionId);
      assert.ok(recommendationPayload.evidence.reflectionCount >= 1);

      const progressResponse = await saveProgressEvent(
        new Request(`http://localhost/api/education-plans/${educationPlanId}/progress-events`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            scheduledSessionId,
            recommendationType: recommendationPayload.type,
            decisionType: "accept",
            rationale: "Fortsatt progression enligt recommendation.",
          }),
        }),
        { params: { id: educationPlanId } },
      );

      assert.equal(progressResponse.status, 201);

      const planResponse = await getEducationPlan(
        new Request(`http://localhost/api/education-plans?id=${educationPlanId}`, {
          method: "GET",
          headers,
        }),
      );
      assert.equal(planResponse.status, 200);

      const plan = (await planResponse.json()) as {
        progressEvents: Array<{
          eventType: string;
          scheduledSessionId?: string;
          recommendationType?: string;
          decisionType?: string;
        }>;
      };

      assert.ok(plan.progressEvents.length >= 1);
      const lastEvent = plan.progressEvents[plan.progressEvents.length - 1];
      assert.equal(lastEvent.eventType, "coachDecisionRecorded");
      assert.equal(lastEvent.scheduledSessionId, scheduledSessionId);
      assert.equal(lastEvent.decisionType, "accept");
    } finally {
      await closePostgresPool();
      process.env.DATABASE_URL = previousDatabaseUrl;
      process.env.REPOSITORY_PROVIDER = previousProvider;
      await db.dispose();
    }
  });
}