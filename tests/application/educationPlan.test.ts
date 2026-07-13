import assert from "node:assert/strict";
import test from "node:test";
import { createEducationPlan, appendEducationPlanProgressEvent, getActiveEducationPlanBlock } from "../../src/domains/educationPlan/entities/EducationPlan";
import { isActiveEducationPlanBlock } from "../../src/domains/educationPlan/entities/EducationPlanBlock";
import { toEducationBlockId, toSessionTemplateId } from "../../src/domains/academy/types/ids";
import { toEducationPlanBlockId, toEducationPlanId, toEducationPlanProgressId } from "../../src/domains/educationPlan/types/ids";

test("education plan domain: creates plan and tracks active block and progress", () => {
  const activeBlockId = toEducationPlanBlockId("plan-block-1");
  const plan = createEducationPlan({
    id: toEducationPlanId("plan-1"),
    organizationId: "org-1",
    teamId: "team-1",
    activeBlockId,
    blocks: [
      {
        id: activeBlockId,
        educationPlanId: toEducationPlanId("plan-1"),
        educationBlockId: toEducationBlockId("block-1"),
        sessionTemplateId: toSessionTemplateId("template-1"),
        order: 1,
        status: "active",
      },
      {
        id: toEducationPlanBlockId("plan-block-2"),
        educationPlanId: toEducationPlanId("plan-1"),
        educationBlockId: toEducationBlockId("block-2"),
        sessionTemplateId: toSessionTemplateId("template-2"),
        order: 2,
        status: "planned",
      },
    ],
    createdAt: "2026-07-13T10:00:00.000Z",
    updatedAt: "2026-07-13T10:00:00.000Z",
  });

  const activeBlock = getActiveEducationPlanBlock(plan);

  assert.equal(plan.status, "planned");
  assert.ok(activeBlock);
  assert.equal(activeBlock?.id, activeBlockId);
  assert.equal(isActiveEducationPlanBlock(activeBlock!), true);

  const updated = appendEducationPlanProgressEvent(plan, {
    id: toEducationPlanProgressId("progress-1"),
    educationPlanId: plan.id,
    educationPlanBlockId: activeBlockId,
    teamId: plan.teamId,
    eventType: "sessionCompleted",
    completedSessionCount: 1,
    createdAt: "2026-07-13T11:00:00.000Z",
  });

  assert.equal(updated.progressEvents.length, 1);
  assert.equal(updated.updatedAt, "2026-07-13T11:00:00.000Z");
  assert.equal(plan.progressEvents.length, 0);
});