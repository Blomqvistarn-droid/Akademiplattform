import type { EducationPlan } from "../../../domains/educationPlan/entities/EducationPlan";
import type { EducationPlanDto } from "../dto/EducationPlanDto";

export function mapEducationPlanToDto(plan: EducationPlan): EducationPlanDto {
  return plan;
}