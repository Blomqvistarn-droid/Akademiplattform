import type { ScheduledSession } from "@/domains/training/entities/ScheduledSession";
import type { SessionReflection } from "@/domains/training/entities/SessionReflection";
import type { TeamProgress } from "@/domains/training/entities/TeamProgress";
import type {
  ScheduledSessionId,
  TeamId,
} from "@/domains/shared/types/ids";

export interface TrainingRepository {
  getScheduledSessions(): readonly ScheduledSession[];
  getScheduledSession(id: ScheduledSessionId): ScheduledSession | null;
  getReflectionsByTeam(teamId: TeamId): readonly SessionReflection[];
  getReflectionsByScheduledSession(
    scheduledSessionId: ScheduledSessionId,
  ): readonly SessionReflection[];
  getProgressByTeam(teamId: TeamId): readonly TeamProgress[];
}
