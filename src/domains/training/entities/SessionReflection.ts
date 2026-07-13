import type {
  ScheduledSessionId,
  SessionReflectionId,
  UserId,
} from "@/domains/shared/types/ids";

export interface SessionReflection {
  id: SessionReflectionId;
  scheduledSessionId: ScheduledSessionId;
  authorId: UserId;
  understandingScore: number;
  independenceScore: number;
  notes: string;
  createdAt: string;
}
