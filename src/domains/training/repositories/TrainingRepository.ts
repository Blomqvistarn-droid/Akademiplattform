import type { ScheduledSession } from "@/domains/training/entities/ScheduledSession";
import type { SessionReflection } from "@/domains/training/entities/SessionReflection";
import type { TeamProgress } from "@/domains/training/entities/TeamProgress";
import type { SessionTemplateId } from "@/domains/academy/types/ids";
import type {
  ScheduledSessionId,
  TeamId,
} from "@/domains/shared/types/ids";

export interface CreateScheduledSessionInput {
  id: ScheduledSessionId;
  teamId: TeamId;
  sessionTemplateId: SessionTemplateId;
  scheduledAt: string;
}

export interface UpdateScheduledSessionInput {
  teamId?: TeamId;
  sessionTemplateId?: SessionTemplateId;
  scheduledAt?: string;
  status?: ScheduledSession["status"];
}

export interface TrainingRepository {
  getScheduledSessions(): Promise<readonly ScheduledSession[]>;
  getScheduledSession(id: ScheduledSessionId): Promise<ScheduledSession | null>;
  getReflectionsByTeam(teamId: TeamId): Promise<readonly SessionReflection[]>;
  getReflectionsByScheduledSession(
    scheduledSessionId: ScheduledSessionId,
  ): Promise<readonly SessionReflection[]>;
  getProgressByTeam(teamId: TeamId): Promise<readonly TeamProgress[]>;
  createScheduledSession(
    input: CreateScheduledSessionInput,
  ): Promise<ScheduledSession>;
  updateScheduledSession(
    id: ScheduledSessionId,
    input: UpdateScheduledSessionInput,
  ): Promise<ScheduledSession | null>;
  archiveScheduledSession(id: ScheduledSessionId): Promise<ScheduledSession | null>;
}
