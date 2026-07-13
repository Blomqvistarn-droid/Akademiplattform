import type { TeamId } from "@/domains/shared/types/ids";
import type {
  EducationPlanBlockId,
  EducationPlanId,
  EducationPlanProgressId,
} from "../types/ids";

export type EducationPlanProgressEventType =
  | "sessionCompleted"
  | "reflectionRecorded"
  | "recommendationRecorded";

export interface EducationPlanProgressEvent {
  id: EducationPlanProgressId;
  educationPlanId: EducationPlanId;
  educationPlanBlockId: EducationPlanBlockId | null;
  teamId: TeamId;
  eventType: EducationPlanProgressEventType;
  completedSessionCount: number;
  createdAt: string;
}