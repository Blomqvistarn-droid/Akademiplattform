import assert from "node:assert/strict";
import test from "node:test";
import { ApplicationError } from "../../src/application/errors/ApplicationError";
import { createEducationPlanUnitOfWork } from "../../src/application/educationPlan/unitOfWork/createEducationPlanUnitOfWork";
import { createLocalEducationPlanRepository } from "../../src/infrastructure/repositories/local/localEducationPlanRepository";
import { InMemoryTransactionRunner } from "../../src/infrastructure/transactions/InMemoryTransactionRunner";
import { saveEducationPlanProgressDecisionHandler } from "../../src/application/educationPlan/handlers/saveEducationPlanProgressDecisionHandler";

function createUnitOfWork() {
  return createEducationPlanUnitOfWork({
    educationPlanRepository: createLocalEducationPlanRepository({
      organizationId: "00000000-0000-0000-0000-000000000001",
    }),
    transactionRunner: new InMemoryTransactionRunner(),
  });
}

test("saveEducationPlanProgressDecisionHandler appends coach decision as a progress event", async () => {
  const unitOfWork = createUnitOfWork();
  const updated = await saveEducationPlanProgressDecisionHandler(unitOfWork, {
    educationPlanId: "00000000-0000-0000-0000-000000010001",
    scheduledSessionId: "00000000-0000-0000-0000-000000001001",
    recommendationType: "advance",
    decisionType: "accept",
    rationale: "Fortsatt progression enligt plan.",
  });

  const lastEvent = updated.progressEvents[updated.progressEvents.length - 1];

  assert.equal(lastEvent.eventType, "coachDecisionRecorded");
  assert.equal(lastEvent.scheduledSessionId, "00000000-0000-0000-0000-000000001001");
  assert.equal(lastEvent.recommendationType, "advance");
  assert.equal(lastEvent.decisionType, "accept");
  assert.equal(lastEvent.rationale, "Fortsatt progression enligt plan.");
});

test("saveEducationPlanProgressDecisionHandler returns NotFound for missing plan", async () => {
  const unitOfWork = createUnitOfWork();

  await assert.rejects(
    () =>
      saveEducationPlanProgressDecisionHandler(unitOfWork, {
        educationPlanId: "missing-plan",
        scheduledSessionId: "00000000-0000-0000-0000-000000001001",
        recommendationType: "advance",
        decisionType: "accept",
      }),
    (error: unknown) => {
      assert.ok(error instanceof ApplicationError);
      assert.equal(error.category, "NotFound");
      return true;
    },
  );
});
