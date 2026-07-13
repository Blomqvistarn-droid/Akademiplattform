import type { TeamId } from "@/domains/shared/types/ids";
import type { EducationPlan } from "../entities/EducationPlan";
import type { EducationPlanId } from "../types/ids";

export interface EducationPlanRepository {
  listEducationPlans(): Promise<readonly EducationPlan[]>;
  getEducationPlan(id: EducationPlanId): Promise<EducationPlan | null>;
  getEducationPlansByTeam(teamId: TeamId): Promise<readonly EducationPlan[]>;
  getActiveEducationPlanByTeam(teamId: TeamId): Promise<EducationPlan | null>;
  saveEducationPlan(plan: EducationPlan): Promise<EducationPlan>;
}