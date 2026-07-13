import type { ScheduledSession } from "@/domains/training/entities/ScheduledSession";
import type { SessionReflection } from "@/domains/training/entities/SessionReflection";
import type { TeamProgress } from "@/domains/training/entities/TeamProgress";
import type {
  ScheduledSessionId,
  TeamId,
} from "@/domains/shared/types/ids";

export interface TrainingRepository {
  getScheduledSessions(): Promise<readonly ScheduledSession[]>;
  getScheduledSession(id: ScheduledSessionId): Promise<ScheduledSession | null>;
  getReflectionsByTeam(teamId: TeamId): Promise<readonly SessionReflection[]>;
  getReflectionsByScheduledSession(
    scheduledSessionId: ScheduledSessionId,
  ): Promise<readonly SessionReflection[]>;
  getProgressByTeam(teamId: TeamId): Promise<readonly TeamProgress[]>;
}
