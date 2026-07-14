import type { TeamId } from "@/domains/shared/types/ids";
import type {
  EducationPlanBlockId,
  EducationPlanId,
  EducationPlanProgressId,
} from "../types/ids";

export type EducationPlanProgressEventType =
  | "sessionCompleted"
  | "reflectionRecorded"
  | "recommendationRecorded"
  | "coachDecisionRecorded";

export type CoachDecisionType = "accept" | "override";

export type RecommendationType = "repeat" | "simplify" | "progress" | "advance";

export interface EducationPlanProgressEvent {
  id: EducationPlanProgressId;
  educationPlanId: EducationPlanId;
  educationPlanBlockId: EducationPlanBlockId | null;
  teamId: TeamId;
  eventType: EducationPlanProgressEventType;
  completedSessionCount: number;
  scheduledSessionId?: string;
  recommendationType?: RecommendationType;
  decisionType?: CoachDecisionType;
  rationale?: string | null;
  createdAt: string;
}