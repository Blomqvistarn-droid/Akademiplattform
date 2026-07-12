import type {
  ScheduledSessionId,
  SessionTemplateId,
  TeamId,
} from "@/domains/shared/types/ids";

export type ScheduledSessionStatus = "planned" | "completed" | "cancelled";

export interface ScheduledSession {
  id: ScheduledSessionId;
  teamId: TeamId;
  sessionTemplateId: SessionTemplateId;
  scheduledAt: string;
  status: ScheduledSessionStatus;
}
