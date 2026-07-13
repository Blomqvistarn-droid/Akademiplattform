import type { EducationBlockId } from "@/domains/academy/types/ids";
import type { SessionTemplateId } from "@/domains/academy/types/ids";
import type { EducationPlanBlockId, EducationPlanId } from "../types/ids";

export type EducationPlanBlockStatus = "planned" | "active" | "completed" | "skipped";

export interface EducationPlanBlock {
  id: EducationPlanBlockId;
  educationPlanId: EducationPlanId;
  educationBlockId: EducationBlockId;
  sessionTemplateId: SessionTemplateId;
  order: number;
  status: EducationPlanBlockStatus;
}

export function isActiveEducationPlanBlock(
  block: EducationPlanBlock,
): boolean {
  return block.status === "active";
}