import type { OrganizationContext } from "../../../application/context/OrganizationContext";
import {
  createEducationPlan,
  type EducationPlan,
} from "../../../domains/educationPlan/entities/EducationPlan";
import type { EducationPlanBlock } from "../../../domains/educationPlan/entities/EducationPlanBlock";
import type { EducationPlanProgressEvent } from "../../../domains/educationPlan/entities/EducationPlanProgress";
import type { EducationPlanRepository } from "../../../domains/educationPlan/repositories/EducationPlanRepository";
import {
  toEducationPlanBlockId,
  toEducationPlanId,
  toEducationPlanProgressId,
} from "../../../domains/educationPlan/types/ids";
import {
  toEducationBlockId,
  toSessionTemplateId,
} from "../../../domains/academy/types/ids";
import { queryWithTransactionClient } from "../../persistence/postgres/postgresTransactionContext";
import type { Pool } from "pg";

export interface PostgresEducationPlanRepositoryOptions {
  organizationContext: OrganizationContext;
  pool: Pool;
}

interface EducationPlanRow {
  id: string;
  organization_id: string;
  team_id: string;
  status: EducationPlan["status"];
  active_block_id: string | null;
  created_at: string;
  updated_at: string;
}

interface EducationPlanBlockRow {
  id: string;
  education_plan_id: string;
  education_block_id: string;
  session_template_id: string;
  block_order: number;
  status: EducationPlanBlock["status"];
}

interface EducationPlanProgressRow {
  id: string;
  education_plan_id: string;
  education_plan_block_id: string | null;
  team_id: string;
  event_type: EducationPlanProgressEvent["eventType"];
  completed_session_count: number;
  scheduled_session_id: string | null;
  recommendation_type: EducationPlanProgressEvent["recommendationType"] | null;
  decision_type: EducationPlanProgressEvent["decisionType"] | null;
  rationale: string | null;
  created_at: string;
}

function mapEducationPlanBlock(row: EducationPlanBlockRow): EducationPlanBlock {
  return {
    id: toEducationPlanBlockId(row.id),
    educationPlanId: toEducationPlanId(row.education_plan_id),
    educationBlockId: toEducationBlockId(row.education_block_id),
    sessionTemplateId: toSessionTemplateId(row.session_template_id),
    order: Number(row.block_order),
    status: row.status,
  };
}

function mapEducationPlanProgressEvent(
  row: EducationPlanProgressRow,
): EducationPlanProgressEvent {
  return {
    id: toEducationPlanProgressId(row.id),
    educationPlanId: toEducationPlanId(row.education_plan_id),
    educationPlanBlockId: row.education_plan_block_id
      ? toEducationPlanBlockId(row.education_plan_block_id)
      : null,
    teamId: row.team_id,
    eventType: row.event_type,
    completedSessionCount: Number(row.completed_session_count),
    scheduledSessionId: row.scheduled_session_id ?? undefined,
    recommendationType: row.recommendation_type ?? undefined,
    decisionType: row.decision_type ?? undefined,
    rationale: row.rationale,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapEducationPlan(
  row: EducationPlanRow,
  blocks: readonly EducationPlanBlock[],
  progressEvents: readonly EducationPlanProgressEvent[],
): EducationPlan {
  return createEducationPlan({
    id: toEducationPlanId(row.id),
    organizationId: row.organization_id,
    teamId: row.team_id,
    status: row.status,
    activeBlockId: row.active_block_id ? toEducationPlanBlockId(row.active_block_id) : null,
    blocks,
    progressEvents,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
}

async function loadPlans(
  pool: Pool,
  organizationId: string,
  whereClause = "",
  values: readonly unknown[] = [],
): Promise<readonly EducationPlan[]> {
  const planResult = await queryWithTransactionClient<EducationPlanRow>(
    pool,
    `
      SELECT id, organization_id, team_id, status, active_block_id, created_at, updated_at
      FROM education_plan
      WHERE organization_id = $1${whereClause}
      ORDER BY created_at ASC, id ASC
    `,
    [organizationId, ...values],
  );

  if (planResult.rowCount === 0) {
    return [];
  }

  const planIds = planResult.rows.map((row) => row.id);

  const blockResult = await queryWithTransactionClient<EducationPlanBlockRow>(
    pool,
    `
      SELECT id, education_plan_id, education_block_id, session_template_id, block_order, status
      FROM education_plan_block
      WHERE organization_id = $1
        AND education_plan_id = ANY($2::uuid[])
      ORDER BY education_plan_id ASC, block_order ASC, id ASC
    `,
    [organizationId, planIds],
  );

  const progressResult = await queryWithTransactionClient<EducationPlanProgressRow>(
    pool,
    `
      SELECT
        id,
        education_plan_id,
        education_plan_block_id,
        team_id,
        event_type,
        completed_session_count,
        scheduled_session_id,
        recommendation_type,
        decision_type,
        rationale,
        created_at
      FROM education_plan_progress_event
      WHERE organization_id = $1
        AND education_plan_id = ANY($2::uuid[])
      ORDER BY education_plan_id ASC, created_at ASC, id ASC
    `,
    [organizationId, planIds],
  );

  const blocksByPlanId = new Map<string, EducationPlanBlock[]>();
  for (const row of blockResult.rows) {
    const blocks = blocksByPlanId.get(row.education_plan_id) ?? [];
    blocks.push(mapEducationPlanBlock(row));
    blocksByPlanId.set(row.education_plan_id, blocks);
  }

  const progressByPlanId = new Map<string, EducationPlanProgressEvent[]>();
  for (const row of progressResult.rows) {
    const events = progressByPlanId.get(row.education_plan_id) ?? [];
    events.push(mapEducationPlanProgressEvent(row));
    progressByPlanId.set(row.education_plan_id, events);
  }

  return planResult.rows.map((row) =>
    mapEducationPlan(
      row,
      blocksByPlanId.get(row.id) ?? [],
      progressByPlanId.get(row.id) ?? [],
    ),
  );
}

export function createPostgresEducationPlanRepository(
  options: PostgresEducationPlanRepositoryOptions,
): EducationPlanRepository {
  const { organizationContext, pool } = options;

  return {
    listEducationPlans: async () =>
      loadPlans(pool, organizationContext.organizationId),
    getEducationPlan: async (id) => {
      const plans = await loadPlans(
        pool,
        organizationContext.organizationId,
        " AND id = $2",
        [id],
      );

      return plans[0] ?? null;
    },
    getEducationPlansByTeam: async (teamId) =>
      loadPlans(pool, organizationContext.organizationId, " AND team_id = $2", [teamId]),
    getActiveEducationPlanByTeam: async (teamId) => {
      const plans = await loadPlans(
        pool,
        organizationContext.organizationId,
        " AND team_id = $2 AND status = 'active'",
        [teamId],
      );

      return plans[0] ?? null;
    },
    saveEducationPlan: async (plan) => {
      await queryWithTransactionClient(
        pool,
        `
          INSERT INTO education_plan (
            id,
            organization_id,
            team_id,
            status,
            active_block_id,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id)
          DO UPDATE SET
            team_id = EXCLUDED.team_id,
            status = EXCLUDED.status,
            active_block_id = EXCLUDED.active_block_id,
            updated_at = EXCLUDED.updated_at
        `,
        [
          plan.id,
          organizationContext.organizationId,
          plan.teamId,
          plan.status,
          plan.activeBlockId,
          plan.createdAt,
          plan.updatedAt,
        ],
      );

      await queryWithTransactionClient(
        pool,
        `
          DELETE FROM education_plan_block
          WHERE organization_id = $1
            AND education_plan_id = $2
        `,
        [organizationContext.organizationId, plan.id],
      );

      await queryWithTransactionClient(
        pool,
        `
          DELETE FROM education_plan_progress_event
          WHERE organization_id = $1
            AND education_plan_id = $2
        `,
        [organizationContext.organizationId, plan.id],
      );

      for (const block of plan.blocks) {
        await queryWithTransactionClient(
          pool,
          `
            INSERT INTO education_plan_block (
              id,
              organization_id,
              education_plan_id,
              education_block_id,
              session_template_id,
              block_order,
              status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [
            block.id,
            organizationContext.organizationId,
            plan.id,
            block.educationBlockId,
            block.sessionTemplateId,
            block.order,
            block.status,
          ],
        );
      }

      for (const event of plan.progressEvents) {
        await queryWithTransactionClient(
          pool,
          `
            INSERT INTO education_plan_progress_event (
              id,
              organization_id,
              education_plan_id,
              education_plan_block_id,
              team_id,
              event_type,
              completed_session_count,
              scheduled_session_id,
              recommendation_type,
              decision_type,
              rationale,
              created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
          [
            event.id,
            organizationContext.organizationId,
            plan.id,
            event.educationPlanBlockId,
            event.teamId,
            event.eventType,
            event.completedSessionCount,
            event.scheduledSessionId ?? null,
            event.recommendationType ?? null,
            event.decisionType ?? null,
            event.rationale ?? null,
            event.createdAt,
          ],
        );
      }

      const saved = await loadPlans(
        pool,
        organizationContext.organizationId,
        " AND id = $2",
        [plan.id],
      );

      if (!saved[0]) {
        throw new Error("Failed to read back saved Education Plan.");
      }

      return saved[0];
    },
  };
}