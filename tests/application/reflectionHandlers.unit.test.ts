import assert from "node:assert/strict";
import test from "node:test";
import type { TrainingRepository } from "../../src/domains/training/repositories/TrainingRepository";
import { createTrainingUnitOfWork } from "../../src/application/unitOfWork/createTrainingUnitOfWork";
import { InMemoryTransactionRunner } from "../../src/infrastructure/transactions/InMemoryTransactionRunner";
import { createReflectionHandler } from "../../src/application/reflection/handlers/createReflectionHandler";
import { getReflectionHandler } from "../../src/application/reflection/handlers/getReflectionHandler";
import { listReflectionsHandler } from "../../src/application/reflection/handlers/listReflectionsHandler";
import { getRecommendationHandler } from "../../src/application/reflection/handlers/getRecommendationHandler";
import { ApplicationError } from "../../src/application/errors/ApplicationError";
import { toSessionTemplateId } from "../../src/domains/academy/types/ids";

function createInMemoryReflectionRepository(): TrainingRepository {
  const sessions = [
    {
      id: "session-2",
      teamId: "team-1",
      sessionTemplateId: toSessionTemplateId("session-winger-2"),
      scheduledAt: "2026-08-11T17:00:00.000Z",
      status: "planned" as const,
    },
    {
      id: "session-1",
      teamId: "team-1",
      sessionTemplateId: toSessionTemplateId("session-winger-1"),
      scheduledAt: "2026-08-10T17:00:00.000Z",
      status: "completed" as const,
    },
  ];

  const reflections: Array<{
    id: string;
    scheduledSessionId: string;
    authorId: string;
    understandingScore: number;
    independenceScore: number;
    notes: string;
    createdAt: string;
  }> = [];

  return {
    getScheduledSessions: async () => sessions,
    getScheduledSession: async (id) => sessions.find((x) => x.id === id) ?? null,
    getReflectionsByTeam: async (teamId) => {
      const sessionIds = new Set(
        sessions.filter((session) => session.teamId === teamId).map((x) => x.id),
      );

      return reflections.filter((x) => sessionIds.has(x.scheduledSessionId));
    },
    getReflectionsByScheduledSession: async (scheduledSessionId) =>
      reflections.filter((x) => x.scheduledSessionId === scheduledSessionId),
    getProgressByTeam: async () => [],
    createScheduledSession: async () => {
      throw new Error("Not used in reflection tests.");
    },
    updateScheduledSession: async () => null,
    archiveScheduledSession: async () => null,
    createReflection: async (input) => {
      const created = {
        id: input.id,
        scheduledSessionId: input.scheduledSessionId,
        authorId: input.authorId,
        understandingScore: input.understandingScore,
        independenceScore: input.independenceScore,
        notes: input.notes,
        createdAt: input.createdAt,
      };

      reflections.push(created);
      return created;
    },
    getReflection: async (id) => reflections.find((x) => x.id === id) ?? null,
  };
}

function createUnitOfWork() {
  return createTrainingUnitOfWork({
    trainingRepository: createInMemoryReflectionRepository(),
    transactionRunner: new InMemoryTransactionRunner(),
  });
}

test("reflection handlers: create/get/list/recommendation flow", async () => {
  const unitOfWork = createUnitOfWork();

  const created = await createReflectionHandler(unitOfWork, {
    scheduledSessionId: "session-1",
    authorId: "coach-1",
    understandingScore: 4,
    independenceScore: 5,
    notes: "Bra beslutsfattande i slutet av passet.",
  });

  const fetched = await getReflectionHandler(unitOfWork, {
    id: created.reflection.id,
  });

  const listed = await listReflectionsHandler(unitOfWork, {
    scheduledSessionId: "session-1",
  });

  const recommendation = await getRecommendationHandler(unitOfWork, {
    scheduledSessionId: "session-1",
  });

  assert.equal(fetched.id, created.reflection.id);
  assert.equal(listed.length, 1);
  assert.equal(recommendation.type, "advance");
  assert.equal(recommendation.isFallback, false);
  assert.equal(recommendation.evidence.reflectionCount, 1);
  assert.equal(recommendation.evidence.scheduledSessionId, "session-1");
  assert.equal(recommendation.evidence.latestReflectionId, created.reflection.id);
  assert.equal(typeof recommendation.pedagogicalRationale, "string");
});

test("reflection handlers: validates score range", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      createReflectionHandler(unitOfWork, {
        scheduledSessionId: "session-1",
        authorId: "coach-1",
        understandingScore: 0,
        independenceScore: 5,
        notes: "Test",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "Validation");
      return true;
    },
  );
});

test("reflection handlers: returns NotFound when session is missing", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      createReflectionHandler(unitOfWork, {
        scheduledSessionId: "missing-session",
        authorId: "coach-1",
        understandingScore: 3,
        independenceScore: 3,
        notes: "Test",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "NotFound");
      return true;
    },
  );
});

test("reflection handlers: list supports empty filters within organization scope", async () => {
  const unitOfWork = createUnitOfWork();

  await createReflectionHandler(unitOfWork, {
    scheduledSessionId: "session-1",
    authorId: "coach-1",
    understandingScore: 3,
    independenceScore: 3,
    notes: "Test",
  });

  const listed = await listReflectionsHandler(unitOfWork, {});
  assert.equal(listed.length, 1);
});

test("reflection handlers: recommendation fallback when no reflections exist", async () => {
  const unitOfWork = createUnitOfWork();

  const recommendation = await getRecommendationHandler(unitOfWork, {
    scheduledSessionId: "session-1",
  });

  assert.equal(recommendation.type, "repeat");
  assert.equal(recommendation.isFallback, true);
  assert.ok(recommendation.fallbackReason);
  assert.equal(recommendation.evidence.reflectionCount, 0);
  assert.equal(recommendation.evidence.latestReflectionId, null);
});

test("reflection handlers: rejects ambiguous list filters", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      listReflectionsHandler(unitOfWork, {
        scheduledSessionId: "session-1",
        teamId: "team-1",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "Validation");
      return true;
    },
  );
});

test("reflection handlers: prevents duplicate reflection per scheduled session", async () => {
  const unitOfWork = createUnitOfWork();

  await createReflectionHandler(unitOfWork, {
    scheduledSessionId: "session-1",
    authorId: "coach-1",
    understandingScore: 4,
    independenceScore: 4,
    notes: "Forsta reflection.",
  });

  await assert.rejects(
    () =>
      createReflectionHandler(unitOfWork, {
        scheduledSessionId: "session-1",
        authorId: "coach-1",
        understandingScore: 5,
        independenceScore: 4,
        notes: "Andra reflection.",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "Conflict");
      return true;
    },
  );
});

test("reflection handlers: allows reflection only for completed sessions", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      createReflectionHandler(unitOfWork, {
        scheduledSessionId: "session-2",
        authorId: "coach-1",
        understandingScore: 3,
        independenceScore: 3,
        notes: "Reflektion innan avslutat pass.",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "DomainRuleViolation");
      return true;
    },
  );
});
