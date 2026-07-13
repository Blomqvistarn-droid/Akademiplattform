import type { ScheduledSessionStatus } from "@/domains/training/entities/ScheduledSession";

export interface TrainingDto {
  id: string;
  teamId: string;
  sessionTemplateId: string;
  scheduledAt: string;
  status: ScheduledSessionStatus;
}
