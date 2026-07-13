import assert from "node:assert/strict";
import test from "node:test";
import type { ScheduledSession } from "../../src/domains/training/entities/ScheduledSession";
import type { TrainingRepository } from "../../src/domains/training/repositories/TrainingRepository";
import { createTrainingUnitOfWork } from "../../src/application/unitOfWork/createTrainingUnitOfWork";
import { InMemoryTransactionRunner } from "../../src/infrastructure/transactions/InMemoryTransactionRunner";
import { createTrainingHandler } from "../../src/application/training/handlers/createTrainingHandler";
import { getTrainingHandler } from "../../src/application/training/handlers/getTrainingHandler";
import { listTrainingsHandler } from "../../src/application/training/handlers/listTrainingsHandler";
import { updateTrainingHandler } from "../../src/application/training/handlers/updateTrainingHandler";
import { archiveTrainingHandler } from "../../src/application/training/handlers/archiveTrainingHandler";
import { ApplicationError } from "../../src/application/errors/ApplicationError";
import { toSessionTemplateId } from "../../src/domains/academy/types/ids";

function createInMemoryTrainingRepository(): TrainingRepository {
  const sessions: ScheduledSession[] = [
    {
      id: "11111111-1111-1111-1111-111111111001",
      teamId: "team-1",
      sessionTemplateId: toSessionTemplateId("session-winger-1"),
      scheduledAt: "2026-08-10T17:00:00.000Z",
      status: "planned" as const,
    },
  ];

  return {
    getScheduledSessions: async () => [...sessions],
    getScheduledSession: async (id) => sessions.find((x) => x.id === id) ?? null,
    getReflectionsByTeam: async () => [],
    getReflectionsByScheduledSession: async () => [],
    getProgressByTeam: async () => [],
    createScheduledSession: async (input) => {
      const created = {
        id: input.id,
        teamId: input.teamId,
        sessionTemplateId: input.sessionTemplateId,
        scheduledAt: input.scheduledAt,
        status: "planned" as const,
      };
      sessions.push(created);
      return created;
    },
    updateScheduledSession: async (id, input) => {
      const existing = sessions.find((x) => x.id === id);
      if (!existing) return null;
      if (input.teamId) existing.teamId = input.teamId;
      if (input.sessionTemplateId) existing.sessionTemplateId = input.sessionTemplateId;
      if (input.scheduledAt) existing.scheduledAt = input.scheduledAt;
      if (input.status) existing.status = input.status;
      return existing;
    },
    archiveScheduledSession: async (id) => {
      const existing = sessions.find((x) => x.id === id);
      if (!existing) return null;
      existing.status = "cancelled";
      return existing;
    },
  };
}

function createUnitOfWork() {
  return createTrainingUnitOfWork({
    trainingRepository: createInMemoryTrainingRepository(),
    transactionRunner: new InMemoryTransactionRunner(),
  });
}

test("training handlers: create/list/get/update/archive flow", async () => {
  const unitOfWork = createUnitOfWork();

  const created = await createTrainingHandler(unitOfWork, {
    teamId: "team-1",
    sessionTemplateId: "session-winger-2",
    scheduledAt: "2026-08-20T17:00:00.000Z",
  });

  const listed = await listTrainingsHandler(unitOfWork, { teamId: "team-1" });
  const loaded = await getTrainingHandler(unitOfWork, { id: created.id });
  const updated = await updateTrainingHandler(unitOfWork, {
    id: created.id,
    status: "completed",
  });
  const archived = await archiveTrainingHandler(unitOfWork, { id: created.id });

  assert.ok(listed.length >= 2);
  assert.equal(loaded.id, created.id);
  assert.equal(updated.status, "completed");
  assert.equal(archived.status, "cancelled");
});

test("training handlers: returns NotFound when id is outside scope", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () => getTrainingHandler(unitOfWork, { id: "missing-id" }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "NotFound");
      return true;
    },
  );
});

test("training handlers: validates required create payload", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      createTrainingHandler(unitOfWork, {
        teamId: "",
        sessionTemplateId: "session-winger-2",
        scheduledAt: "2026-08-20T17:00:00.000Z",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "Validation");
      return true;
    },
  );
});
