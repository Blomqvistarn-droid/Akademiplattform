import type { Pool } from "pg";

export async function createEducationPlanTablesForCoachFlow(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE education_plan (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      team_id uuid NOT NULL,
      status text NOT NULL,
      active_block_id uuid NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL,
      CONSTRAINT education_plan_team_fk
        FOREIGN KEY (team_id, organization_id)
        REFERENCES team(id, organization_id)
        ON DELETE RESTRICT,
      CONSTRAINT education_plan_status_check
        CHECK (status IN ('planned', 'active', 'completed', 'cancelled'))
    );
  `);

  await pool.query(`
    CREATE TABLE education_plan_block (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      education_plan_id uuid NOT NULL REFERENCES education_plan(id) ON DELETE CASCADE,
      education_block_id text NOT NULL,
      session_template_id text NOT NULL,
      block_order integer NOT NULL,
      status text NOT NULL,
      CONSTRAINT education_plan_block_status_check
        CHECK (status IN ('planned', 'active', 'completed', 'skipped')),
      CONSTRAINT education_plan_block_order_check CHECK (block_order >= 1)
    );
  `);

  await pool.query(`
    CREATE TABLE education_plan_progress_event (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      education_plan_id uuid NOT NULL REFERENCES education_plan(id) ON DELETE CASCADE,
      education_plan_block_id uuid NULL,
      team_id uuid NOT NULL,
      event_type text NOT NULL,
      completed_session_count integer NOT NULL,
      scheduled_session_id uuid NULL,
      recommendation_type text NULL,
      decision_type text NULL,
      rationale text NULL,
      created_at timestamptz NOT NULL,
      CONSTRAINT education_plan_progress_event_type_check
        CHECK (event_type IN ('sessionCompleted', 'reflectionRecorded', 'recommendationRecorded', 'coachDecisionRecorded')),
      CONSTRAINT education_plan_progress_event_completed_count_check
        CHECK (completed_session_count >= 0),
      CONSTRAINT education_plan_progress_event_team_fk
        FOREIGN KEY (team_id, organization_id)
        REFERENCES team(id, organization_id)
        ON DELETE RESTRICT
    );
  `);
}

export async function seedEducationPlanDataForCoachFlow(pool: Pool): Promise<void> {
  await pool.query(`
    INSERT INTO education_plan (
      id,
      organization_id,
      team_id,
      status,
      active_block_id,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000010001',
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000101',
      'active',
      '00000000-0000-0000-0000-000000020001',
      '2026-07-14T10:00:00.000Z',
      '2026-07-14T10:00:00.000Z'
    )
  `);

  await pool.query(`
    INSERT INTO education_plan_block (
      id,
      organization_id,
      education_plan_id,
      education_block_id,
      session_template_id,
      block_order,
      status
    )
    VALUES
      (
        '00000000-0000-0000-0000-000000020001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000010001',
        'block-winger',
        'session-winger-1',
        1,
        'active'
      ),
      (
        '00000000-0000-0000-0000-000000020002',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000010001',
        'block-winger',
        'session-winger-2',
        2,
        'planned'
      )
  `);
}