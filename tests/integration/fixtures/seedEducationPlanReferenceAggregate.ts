import type { Pool } from "pg";

export async function createEducationPlanReferenceSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE organization (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE team (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      name text NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL,
      CONSTRAINT team_id_organization_id_unique UNIQUE (id, organization_id),
      CONSTRAINT team_organization_name_unique UNIQUE (organization_id, name)
    );
  `);

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

  await pool.query(`
    CREATE INDEX education_plan_org_team_idx
      ON education_plan (organization_id, team_id);
  `);

  await pool.query(`
    CREATE INDEX education_plan_block_plan_idx
      ON education_plan_block (organization_id, education_plan_id, block_order);
  `);

  await pool.query(`
    CREATE INDEX education_plan_progress_plan_idx
      ON education_plan_progress_event (organization_id, education_plan_id, created_at);
  `);
}

export async function seedEducationPlanReferenceData(pool: Pool): Promise<void> {
  await pool.query(`
    INSERT INTO organization (id, name, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-00000000c001', 'Contract Org A', '2026-07-14T00:00:00.000Z', '2026-07-14T00:00:00.000Z'),
      ('00000000-0000-0000-0000-00000000c002', 'Contract Org B', '2026-07-14T00:00:00.000Z', '2026-07-14T00:00:00.000Z');
  `);

  await pool.query(`
    INSERT INTO team (id, organization_id, name, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-00000000c101', '00000000-0000-0000-0000-00000000c001', 'Contract Team A', '2026-07-14T00:00:00.000Z', '2026-07-14T00:00:00.000Z'),
      ('00000000-0000-0000-0000-00000000c102', '00000000-0000-0000-0000-00000000c002', 'Contract Team B', '2026-07-14T00:00:00.000Z', '2026-07-14T00:00:00.000Z');
  `);
}