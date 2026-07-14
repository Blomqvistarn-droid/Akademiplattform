import type { CoachDecisionType, RecommendationType } from "../../../domains/educationPlan/entities/EducationPlanProgress";

export interface SaveEducationPlanProgressDecisionCommand {
  educationPlanId: string;
  scheduledSessionId: string;
  recommendationType: RecommendationType;
  decisionType: CoachDecisionType;
  rationale?: string;
}
