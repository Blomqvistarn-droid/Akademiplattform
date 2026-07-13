import type { OrganizationId, TeamId } from "@/domains/shared/types/ids";
import type { EducationPlanBlock } from "./EducationPlanBlock";
import type { EducationPlanProgressEvent } from "./EducationPlanProgress";
import type { EducationPlanBlockId, EducationPlanId } from "../types/ids";

export type EducationPlanStatus = "planned" | "active" | "completed" | "cancelled";

export interface EducationPlan {
  id: EducationPlanId;
  organizationId: OrganizationId;
  teamId: TeamId;
  status: EducationPlanStatus;
  activeBlockId: EducationPlanBlockId | null;
  blocks: readonly EducationPlanBlock[];
  progressEvents: readonly EducationPlanProgressEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationPlanInput {
  id: EducationPlanId;
  organizationId: OrganizationId;
  teamId: TeamId;
  activeBlockId?: EducationPlanBlockId | null;
  blocks?: readonly EducationPlanBlock[];
  progressEvents?: readonly EducationPlanProgressEvent[];
  status?: EducationPlanStatus;
  createdAt: string;
  updatedAt: string;
}

export function createEducationPlan(
  input: CreateEducationPlanInput,
): EducationPlan {
  return {
    id: input.id,
    organizationId: input.organizationId,
    teamId: input.teamId,
    status: input.status ?? "planned",
    activeBlockId: input.activeBlockId ?? null,
    blocks: [...(input.blocks ?? [])].sort((left, right) => left.order - right.order),
    progressEvents: [...(input.progressEvents ?? [])],
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export function getActiveEducationPlanBlock(
  plan: EducationPlan,
): EducationPlanBlock | null {
  if (!plan.activeBlockId) {
    return null;
  }

  return plan.blocks.find((block) => block.id === plan.activeBlockId) ?? null;
}

export function appendEducationPlanProgressEvent(
  plan: EducationPlan,
  event: EducationPlanProgressEvent,
): EducationPlan {
  return {
    ...plan,
    progressEvents: [...plan.progressEvents, event],
    updatedAt: event.createdAt,
  };
}