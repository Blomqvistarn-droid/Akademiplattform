import type {
  ScheduledSessionId,
  TeamId,
} from "@/domains/shared/types/ids";
import type { SessionTemplateId } from "@/domains/academy/types/ids";

export type ScheduledSessionStatus = "planned" | "completed" | "cancelled";

export interface ScheduledSession {
  id: ScheduledSessionId;
  teamId: TeamId;
  sessionTemplateId: SessionTemplateId;
  scheduledAt: string;
  status: ScheduledSessionStatus;
}
