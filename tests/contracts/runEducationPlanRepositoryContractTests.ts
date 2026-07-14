import assert from "node:assert/strict";
import test from "node:test";
import { createEducationPlan } from "../../src/domains/educationPlan/entities/EducationPlan";
import type { EducationPlanRepository } from "../../src/domains/educationPlan/repositories/EducationPlanRepository";
import {
  toEducationPlanBlockId,
  toEducationPlanId,
  toEducationPlanProgressId,
} from "../../src/domains/educationPlan/types/ids";
import {
  toEducationBlockId,
  toSessionTemplateId,
} from "../../src/domains/academy/types/ids";

const ORGANIZATION_ID = "00000000-0000-0000-0000-00000000c001";
const SECOND_ORGANIZATION_ID = "00000000-0000-0000-0000-00000000c002";
const TEAM_ID = "00000000-0000-0000-0000-00000000c101";
const SECOND_TEAM_ID = "00000000-0000-0000-0000-00000000c102";

export interface EducationPlanRepositoryContractFactory {
  createForOrganization(organizationId: string): Promise<EducationPlanRepository>;
}

function createPlan(
  organizationId: string,
  teamId: string,
  suffix: string,
  status: "planned" | "active" | "completed" | "cancelled" = "planned",
  updatedAt = "2026-07-14T12:00:00.000Z",
) {
  const planId = toEducationPlanId(`00000000-0000-0000-0000-00000001${suffix}`);
  const blockId = toEducationPlanBlockId(`00000000-0000-0000-0000-00000002${suffix}`);
  const progressId = toEducationPlanProgressId(`00000000-0000-0000-0000-00000003${suffix}`);

  return createEducationPlan({
    id: planId,
    organizationId,
    teamId,
    status,
    activeBlockId: blockId,
    blocks: [
      {
        id: blockId,
        educationPlanId: planId,
        educationBlockId: toEducationBlockId(`education-block-${suffix}`),
        sessionTemplateId: toSessionTemplateId(`session-template-${suffix}`),
        order: 1,
        status: "active",
      },
    ],
    progressEvents: [
      {
        id: progressId,
        educationPlanId: planId,
        educationPlanBlockId: blockId,
        teamId,
        eventType: "coachDecisionRecorded",
        completedSessionCount: 1,
        scheduledSessionId: `00000000-0000-0000-0000-00000004${suffix}`,
        recommendationType: "progress",
        decisionType: "accept",
        rationale: `contract-${suffix}`,
        createdAt: updatedAt,
      },
    ],
    createdAt: "2026-07-14T11:00:00.000Z",
    updatedAt,
  });
}

export function runEducationPlanRepositoryContractTests(
  label: string,
  factory: EducationPlanRepositoryContractFactory,
): void {
  test(`${label}: saves and reads back the same plan`, async () => {
    const repository = await factory.createForOrganization(ORGANIZATION_ID);
    const plan = createPlan(ORGANIZATION_ID, TEAM_ID, "1101");

    await repository.saveEducationPlan(plan);

    const loaded = await repository.getEducationPlan(plan.id);

    assert.deepEqual(loaded, plan);
  });

  test(`${label}: lists team plans and resolves active plan`, async () => {
    const repository = await factory.createForOrganization(ORGANIZATION_ID);
    const plan = createPlan(ORGANIZATION_ID, TEAM_ID, "1102", "active");

    await repository.saveEducationPlan(plan);

    const listed = await repository.listEducationPlans();
    const byTeam = await repository.getEducationPlansByTeam(TEAM_ID);
    const active = await repository.getActiveEducationPlanByTeam(TEAM_ID);

    assert.equal(listed.some((item) => item.id === plan.id), true);
    assert.equal(byTeam.some((item) => item.id === plan.id), true);
    assert.deepEqual(active, plan);
  });

  test(`${label}: isolates organizations`, async () => {
    const first = await factory.createForOrganization(ORGANIZATION_ID);
    const second = await factory.createForOrganization(SECOND_ORGANIZATION_ID);
    const firstPlan = createPlan(ORGANIZATION_ID, TEAM_ID, "1103");
    const secondPlan = createPlan(SECOND_ORGANIZATION_ID, SECOND_TEAM_ID, "1104");

    await first.saveEducationPlan(firstPlan);
    await second.saveEducationPlan(secondPlan);

    assert.equal((await first.listEducationPlans()).some((item) => item.id === secondPlan.id), false);
    assert.equal((await second.listEducationPlans()).some((item) => item.id === firstPlan.id), false);
  });

  test(`${label}: returns null for missing plan`, async () => {
    const repository = await factory.createForOrganization(ORGANIZATION_ID);

    const loaded = await repository.getEducationPlan(
      toEducationPlanId("00000000-0000-0000-0000-000000019999"),
    );

    assert.equal(loaded, null);
  });
}