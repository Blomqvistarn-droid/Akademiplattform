import type { OrganizationContext } from "../../../application/context/OrganizationContext";
import type { EducationPlan } from "../../../domains/educationPlan/entities/EducationPlan";
import type { EducationPlanRepository } from "../../../domains/educationPlan/repositories/EducationPlanRepository";
import {
  toEducationPlanBlockId,
  toEducationPlanId,
} from "../../../domains/educationPlan/types/ids";
import {
  toEducationBlockId,
  toSessionTemplateId,
} from "../../../domains/academy/types/ids";

interface ScopedEducationPlanData {
  readonly organizationId: string;
  readonly plans: readonly EducationPlan[];
}

interface MutableScopedEducationPlanData {
  organizationId: string;
  plans: EducationPlan[];
}

const EDUCATION_PLAN_DATA: readonly ScopedEducationPlanData[] = [
  {
    organizationId: "00000000-0000-0000-0000-000000000001",
    plans: [
      {
        id: toEducationPlanId("00000000-0000-0000-0000-000000010001"),
        organizationId: "00000000-0000-0000-0000-000000000001",
        teamId: "00000000-0000-0000-0000-000000000101",
        status: "active",
        activeBlockId: toEducationPlanBlockId("00000000-0000-0000-0000-000000020001"),
        blocks: [
          {
            id: toEducationPlanBlockId("00000000-0000-0000-0000-000000020001"),
            educationPlanId: toEducationPlanId(
              "00000000-0000-0000-0000-000000010001",
            ),
            educationBlockId: toEducationBlockId("block-winger"),
            sessionTemplateId: toSessionTemplateId("session-winger-1"),
            order: 1,
            status: "active",
          },
          {
            id: toEducationPlanBlockId("00000000-0000-0000-0000-000000020002"),
            educationPlanId: toEducationPlanId(
              "00000000-0000-0000-0000-000000010001",
            ),
            educationBlockId: toEducationBlockId("block-winger"),
            sessionTemplateId: toSessionTemplateId("session-winger-2"),
            order: 2,
            status: "planned",
          },
        ],
        progressEvents: [],
        createdAt: "2026-07-13T10:00:00.000Z",
        updatedAt: "2026-07-13T10:00:00.000Z",
      },
    ],
  },
  {
    organizationId: "00000000-0000-0000-0000-000000000002",
    plans: [],
  },
];

const STORE = new Map<string, MutableScopedEducationPlanData>(
  EDUCATION_PLAN_DATA.map((item) => [
    item.organizationId,
    { organizationId: item.organizationId, plans: [...item.plans] },
  ]),
);

function getScopedData(organizationId: string): MutableScopedEducationPlanData {
  const existing = STORE.get(organizationId);

  if (existing) {
    return existing;
  }

  const created: MutableScopedEducationPlanData = {
    organizationId,
    plans: [],
  };

  STORE.set(organizationId, created);
  return created;
}

export function createLocalEducationPlanRepository(
  context: OrganizationContext,
): EducationPlanRepository {
  const scoped = getScopedData(context.organizationId);

  return {
    listEducationPlans: async () => [...scoped.plans],
    getEducationPlan: async (id) => scoped.plans.find((plan) => plan.id === id) ?? null,
    getEducationPlansByTeam: async (teamId) =>
      scoped.plans.filter((plan) => plan.teamId === teamId),
    getActiveEducationPlanByTeam: async (teamId) =>
      scoped.plans.find((plan) => plan.teamId === teamId && plan.status === "active") ?? null,
    saveEducationPlan: async (plan) => {
      const existingIndex = scoped.plans.findIndex((item) => item.id === plan.id);

      if (existingIndex >= 0) {
        scoped.plans[existingIndex] = plan;
      } else {
        scoped.plans.push(plan);
      }

      return plan;
    },
  };
}