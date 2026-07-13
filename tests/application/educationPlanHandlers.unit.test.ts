import assert from "node:assert/strict";
import test from "node:test";
import { ApplicationError } from "../../src/application/errors/ApplicationError";
import { createEducationPlanUnitOfWork } from "../../src/application/educationPlan/unitOfWork/createEducationPlanUnitOfWork";
import { createLocalEducationPlanRepository } from "../../src/infrastructure/repositories/local/localEducationPlanRepository";
import { InMemoryTransactionRunner } from "../../src/infrastructure/transactions/InMemoryTransactionRunner";
import { listEducationPlansHandler } from "../../src/application/educationPlan/handlers/listEducationPlansHandler";
import { getEducationPlanHandler } from "../../src/application/educationPlan/handlers/getEducationPlanHandler";
import { startEducationPlanHandler } from "../../src/application/educationPlan/handlers/startEducationPlanHandler";

function createUnitOfWork() {
  return createEducationPlanUnitOfWork({
    educationPlanRepository: createLocalEducationPlanRepository({
      organizationId: "00000000-0000-0000-0000-000000000001",
    }),
    transactionRunner: new InMemoryTransactionRunner(),
  });
}

test("education plan handlers: list/get/start flow", async () => {
  const unitOfWork = createUnitOfWork();

  const listed = await listEducationPlansHandler(unitOfWork, {
    teamId: "00000000-0000-0000-0000-000000000101",
  });
  const loaded = await getEducationPlanHandler(unitOfWork, { id: listed[0].id });
  const started = await startEducationPlanHandler(unitOfWork, {
    organizationId: "00000000-0000-0000-0000-000000000001",
    teamId: "team-2",
  });

  assert.ok(listed.length >= 1);
  assert.equal(loaded.id, listed[0].id);
  assert.equal(started.teamId, "team-2");
});

test("education plan handlers: returns NotFound for unknown id", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () => getEducationPlanHandler(unitOfWork, { id: "missing" }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "NotFound");
      return true;
    },
  );
});

test("education plan handlers: validates required start payload", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      startEducationPlanHandler(unitOfWork, {
        organizationId: "",
        teamId: "",
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      return true;
    },
  );
});