import type { TrainingDto } from "../dto/TrainingDto";
import type { ScheduledSession } from "../../../domains/training/entities/ScheduledSession";

export function mapScheduledSessionToDto(session: ScheduledSession): TrainingDto {
  return {
    id: String(session.id),
    teamId: String(session.teamId),
    sessionTemplateId: String(session.sessionTemplateId),
    scheduledAt: session.scheduledAt,
    status: session.status,
  };
}
