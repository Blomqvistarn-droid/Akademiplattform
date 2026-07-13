import type { OrganizationContext } from "@/application/context/OrganizationContext";
import type { TrainingRepository } from "@/domains/training/repositories/TrainingRepository";
import type { ScheduledSession } from "@/domains/training/entities/ScheduledSession";
import type { SessionReflection } from "@/domains/training/entities/SessionReflection";
import type { TeamProgress } from "@/domains/training/entities/TeamProgress";
import {
  toEducationBlockId,
  toSessionTemplateId,
} from "../../../domains/academy/types/ids";

interface ScopedTrainingData {
  readonly organizationId: string;
  readonly scheduledSessions: readonly ScheduledSession[];
  readonly reflections: readonly SessionReflection[];
  readonly progress: readonly TeamProgress[];
}

const TRAINING_DATA: readonly ScopedTrainingData[] = [
  {
    organizationId: "00000000-0000-0000-0000-000000000001",
    scheduledSessions: [
      {
        id: "00000000-0000-0000-0000-000000001001",
        teamId: "00000000-0000-0000-0000-000000000101",
        sessionTemplateId: toSessionTemplateId("session-winger-1"),
        scheduledAt: "2026-08-10T17:00:00.000Z",
        status: "planned",
      },
      {
        id: "00000000-0000-0000-0000-000000001002",
        teamId: "00000000-0000-0000-0000-000000000101",
        sessionTemplateId: toSessionTemplateId("session-winger-2"),
        scheduledAt: "2026-08-12T17:00:00.000Z",
        status: "completed",
      },
    ],
    reflections: [
      {
        id: "00000000-0000-0000-0000-000000002001",
        scheduledSessionId: "00000000-0000-0000-0000-000000001002",
        authorId: "00000000-0000-0000-0000-000000000201",
        notes: "Bra progression i overlagsspelet.",
        createdAt: "2026-08-12T19:05:00.000Z",
      },
    ],
    progress: [
      {
        id: "00000000-0000-0000-0000-000000003001",
        teamId: "00000000-0000-0000-0000-000000000101",
        educationBlockId: toEducationBlockId("block-winger"),
        completedSessionCount: 2,
        updatedAt: "2026-08-12T19:10:00.000Z",
      },
    ],
  },
  {
    organizationId: "00000000-0000-0000-0000-000000000002",
    scheduledSessions: [
      {
        id: "00000000-0000-0000-0000-000000001101",
        teamId: "00000000-0000-0000-0000-000000000102",
        sessionTemplateId: toSessionTemplateId("session-striker-1"),
        scheduledAt: "2026-08-15T16:30:00.000Z",
        status: "planned",
      },
    ],
    reflections: [],
    progress: [
      {
        id: "00000000-0000-0000-0000-000000003101",
        teamId: "00000000-0000-0000-0000-000000000102",
        educationBlockId: toEducationBlockId("block-striker"),
        completedSessionCount: 1,
        updatedAt: "2026-08-15T18:00:00.000Z",
      },
    ],
  },
];

function getScopedData(organizationId: string): ScopedTrainingData {
  const scoped = TRAINING_DATA.find((item) => item.organizationId === organizationId);

  if (!scoped) {
    return {
      organizationId,
      scheduledSessions: [],
      reflections: [],
      progress: [],
    };
  }

  return scoped;
}

export function createLocalTrainingRepository(
  context: OrganizationContext,
): TrainingRepository {
  const scoped = getScopedData(context.organizationId);

  return {
    getScheduledSessions: async () => scoped.scheduledSessions,
    getScheduledSession: async (id) =>
      scoped.scheduledSessions.find((session) => session.id === id) ?? null,
    getReflectionsByTeam: async (teamId) => {
      const sessionIds = new Set(
        scoped.scheduledSessions
          .filter((session) => session.teamId === teamId)
          .map((session) => session.id),
      );

      return scoped.reflections.filter((reflection) =>
        sessionIds.has(reflection.scheduledSessionId),
      );
    },
    getReflectionsByScheduledSession: async (scheduledSessionId) =>
      scoped.reflections.filter(
        (reflection) => reflection.scheduledSessionId === scheduledSessionId,
      ),
    getProgressByTeam: async (teamId) =>
      scoped.progress.filter((entry) => entry.teamId === teamId),
  };
}
