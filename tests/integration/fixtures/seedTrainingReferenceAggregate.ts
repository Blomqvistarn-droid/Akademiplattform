import type { Pool } from "pg";

export async function createTrainingReferenceSchema(pool: Pool): Promise<void> {
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
    CREATE TABLE scheduled_session (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      team_id uuid NOT NULL,
      session_template_id text NOT NULL,
      scheduled_at timestamptz NOT NULL,
      status text NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL,
      CONSTRAINT scheduled_session_id_organization_id_unique UNIQUE (id, organization_id),
      CONSTRAINT scheduled_session_status_check CHECK (status IN ('planned', 'completed', 'cancelled')),
      CONSTRAINT scheduled_session_team_fk
        FOREIGN KEY (team_id, organization_id)
        REFERENCES team(id, organization_id)
        ON DELETE RESTRICT
    );
  `);

  await pool.query(`
    CREATE TABLE session_reflection (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      scheduled_session_id uuid NOT NULL,
      author_id uuid NOT NULL,
      notes text NOT NULL,
      created_at timestamptz NOT NULL,
      CONSTRAINT session_reflection_scheduled_session_fk
        FOREIGN KEY (scheduled_session_id, organization_id)
        REFERENCES scheduled_session(id, organization_id)
        ON DELETE RESTRICT
    );
  `);

  await pool.query(`
    CREATE TABLE team_progress (
      id uuid PRIMARY KEY,
      organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
      team_id uuid NOT NULL,
      education_block_id text NOT NULL,
      completed_session_count integer NOT NULL,
      updated_at timestamptz NOT NULL,
      CONSTRAINT team_progress_team_fk
        FOREIGN KEY (team_id, organization_id)
        REFERENCES team(id, organization_id)
        ON DELETE RESTRICT,
      CONSTRAINT team_progress_completed_session_count_check CHECK (completed_session_count >= 0),
      CONSTRAINT team_progress_team_block_unique UNIQUE (organization_id, team_id, education_block_id)
    );
  `);
}

export async function seedTrainingReferenceData(pool: Pool): Promise<void> {
  await pool.query(`
    INSERT INTO organization (id, name, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'Org A', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
      ('00000000-0000-0000-0000-000000000002', 'Org B', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z');
  `);

  await pool.query(`
    INSERT INTO team (id, organization_id, name, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Team A', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
      ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'Team B', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z');
  `);

  await pool.query(`
    INSERT INTO scheduled_session (id, organization_id, team_id, session_template_id, scheduled_at, status, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'session-winger-1', '2026-08-10T17:00:00.000Z', 'planned', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
      ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'session-winger-2', '2026-08-12T17:00:00.000Z', 'completed', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
      ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'session-striker-1', '2026-08-15T16:30:00.000Z', 'planned', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z');
  `);

  await pool.query(`
    INSERT INTO session_reflection (id, organization_id, scheduled_session_id, author_id, notes, created_at)
    VALUES
      ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000201', 'Bra progression i overlagsspelet.', '2026-08-12T19:05:00.000Z');
  `);

  await pool.query(`
    INSERT INTO team_progress (id, organization_id, team_id, education_block_id, completed_session_count, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'block-winger', 2, '2026-08-12T19:10:00.000Z'),
      ('00000000-0000-0000-0000-000000003101', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'block-striker', 1, '2026-08-15T18:00:00.000Z');
  `);
}
