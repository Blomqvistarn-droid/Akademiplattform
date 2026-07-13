import type { OrganizationContext } from "@/application/context/OrganizationContext";
import { toEducationBlockId, toSessionTemplateId } from "../../../domains/academy/types/ids";
import type { ScheduledSession } from "@/domains/training/entities/ScheduledSession";
import type { SessionReflection } from "@/domains/training/entities/SessionReflection";
import type { TeamProgress } from "@/domains/training/entities/TeamProgress";
import type { TrainingRepository } from "@/domains/training/repositories/TrainingRepository";
import { queryWithTransactionClient } from "../../persistence/postgres/postgresTransactionContext";
import type { Pool } from "pg";

interface PostgresTrainingRepositoryOptions {
  organizationContext: OrganizationContext;
  pool: Pool;
}

type QueryRow = Record<string, unknown>;

function mapScheduledSession(row: QueryRow): ScheduledSession {
  return {
    id: String(row.id),
    teamId: String(row.team_id),
    sessionTemplateId: toSessionTemplateId(String(row.session_template_id)),
    scheduledAt: new Date(String(row.scheduled_at)).toISOString(),
    status: String(row.status) as ScheduledSession["status"],
  };
}

function mapSessionReflection(row: QueryRow): SessionReflection {
  return {
    id: String(row.id),
    scheduledSessionId: String(row.scheduled_session_id),
    authorId: String(row.author_id),
    notes: String(row.notes),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function mapTeamProgress(row: QueryRow): TeamProgress {
  return {
    id: String(row.id),
    teamId: String(row.team_id),
    educationBlockId: toEducationBlockId(String(row.education_block_id)),
    completedSessionCount: Number(row.completed_session_count),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export function createPostgresTrainingRepository(
  options: PostgresTrainingRepositoryOptions,
): TrainingRepository {
  const { organizationContext, pool } = options;

  return {
    getScheduledSessions: async () => {
      const result = await queryWithTransactionClient(
        pool,
        `
          SELECT id, team_id, session_template_id, scheduled_at, status
          FROM scheduled_session
          WHERE organization_id = $1
          ORDER BY scheduled_at ASC
        `,
        [organizationContext.organizationId],
      );

      return result.rows.map(mapScheduledSession);
    },
    getScheduledSession: async (id) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          SELECT id, team_id, session_template_id, scheduled_at, status
          FROM scheduled_session
          WHERE organization_id = $1
            AND id = $2
          LIMIT 1
        `,
        [organizationContext.organizationId, id],
      );

      if (result.rowCount === 0) {
        return null;
      }

      return mapScheduledSession(result.rows[0]);
    },
    getReflectionsByTeam: async (teamId) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          SELECT r.id, r.scheduled_session_id, r.author_id, r.notes, r.created_at
          FROM session_reflection r
          INNER JOIN scheduled_session s
            ON s.id = r.scheduled_session_id
           AND s.organization_id = r.organization_id
          WHERE r.organization_id = $1
            AND s.team_id = $2
          ORDER BY r.created_at ASC
        `,
        [organizationContext.organizationId, teamId],
      );

      return result.rows.map(mapSessionReflection);
    },
    getReflectionsByScheduledSession: async (scheduledSessionId) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          SELECT id, scheduled_session_id, author_id, notes, created_at
          FROM session_reflection
          WHERE organization_id = $1
            AND scheduled_session_id = $2
          ORDER BY created_at ASC
        `,
        [organizationContext.organizationId, scheduledSessionId],
      );

      return result.rows.map(mapSessionReflection);
    },
    getProgressByTeam: async (teamId) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          SELECT id, team_id, education_block_id, completed_session_count, updated_at
          FROM team_progress
          WHERE organization_id = $1
            AND team_id = $2
          ORDER BY updated_at DESC
        `,
        [organizationContext.organizationId, teamId],
      );

      return result.rows.map(mapTeamProgress);
    },
    createScheduledSession: async (input) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          INSERT INTO scheduled_session (
            id,
            organization_id,
            team_id,
            session_template_id,
            scheduled_at,
            status,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, 'planned', NOW(), NOW())
          RETURNING id, team_id, session_template_id, scheduled_at, status
        `,
        [
          input.id,
          organizationContext.organizationId,
          input.teamId,
          input.sessionTemplateId,
          input.scheduledAt,
        ],
      );

      return mapScheduledSession(result.rows[0]);
    },
    updateScheduledSession: async (id, input) => {
      const existing = await queryWithTransactionClient(
        pool,
        `
          SELECT id
          FROM scheduled_session
          WHERE organization_id = $1
            AND id = $2
          LIMIT 1
        `,
        [organizationContext.organizationId, id],
      );

      if (existing.rowCount === 0) {
        return null;
      }

      const result = await queryWithTransactionClient(
        pool,
        `
          UPDATE scheduled_session
          SET
            team_id = COALESCE($3, team_id),
            session_template_id = COALESCE($4, session_template_id),
            scheduled_at = COALESCE($5, scheduled_at),
            status = COALESCE($6, status),
            updated_at = NOW()
          WHERE organization_id = $1
            AND id = $2
          RETURNING id, team_id, session_template_id, scheduled_at, status
        `,
        [
          organizationContext.organizationId,
          id,
          input.teamId ?? null,
          input.sessionTemplateId ?? null,
          input.scheduledAt ?? null,
          input.status ?? null,
        ],
      );

      return mapScheduledSession(result.rows[0]);
    },
    archiveScheduledSession: async (id) => {
      const result = await queryWithTransactionClient(
        pool,
        `
          UPDATE scheduled_session
          SET status = 'cancelled', updated_at = NOW()
          WHERE organization_id = $1
            AND id = $2
          RETURNING id, team_id, session_template_id, scheduled_at, status
        `,
        [organizationContext.organizationId, id],
      );

      if (result.rowCount === 0) {
        return null;
      }

      return mapScheduledSession(result.rows[0]);
    },
  };
}
