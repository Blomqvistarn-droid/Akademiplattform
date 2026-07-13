import type { EducationPlanBlock } from "../../../domains/educationPlan/entities/EducationPlanBlock";

export interface StartEducationPlanCommand {
  organizationId: string;
  teamId: string;
  activeBlockId?: string | null;
  blocks?: readonly EducationPlanBlock[];
}