import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";
import {
  createSchemaScopedPool,
  hasTestDatabase,
  withIsolatedPostgresSchema,
} from "./fixtures/postgresTestDatabase";
import { createTrainingReferenceSchema } from "./fixtures/seedTrainingReferenceAggregate";

function getConnectionString(): string | null {
  return process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

test("postgres integration: verifies required env for DB tests", () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return;
  }

  assert.ok(connectionString.length > 0);
});

test("postgres integration: migration tables exist when DB is configured", async () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(
      `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN (
            'organization',
            'team',
            'scheduled_session',
            'session_reflection',
            'team_progress'
          )
        ORDER BY table_name
      `,
    );

    assert.deepEqual(
      result.rows.map((row) => row.table_name),
      [
        "organization",
        "scheduled_session",
        "session_reflection",
        "team",
        "team_progress",
      ],
    );
  } finally {
    await client.end();
  }
});

test("postgres integration: rejects cross-organization scheduled session relation", async () => {
  if (!hasTestDatabase()) {
    return;
  }

  await withIsolatedPostgresSchema(async (db) => {
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);

      await pool.query(`
        INSERT INTO organization (id, name, created_at, updated_at)
        VALUES
          ('00000000-0000-0000-0000-00000000a001', 'Org A', NOW(), NOW()),
          ('00000000-0000-0000-0000-00000000b001', 'Org B', NOW(), NOW())
      `);

      await pool.query(`
        INSERT INTO team (id, organization_id, name, created_at, updated_at)
        VALUES
          ('00000000-0000-0000-0000-00000000b101', '00000000-0000-0000-0000-00000000b001', 'Team B', NOW(), NOW())
      `);

      await assert.rejects(
        pool.query(
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
            VALUES (
              '00000000-0000-0000-0000-00000000a201',
              '00000000-0000-0000-0000-00000000a001',
              '00000000-0000-0000-0000-00000000b101',
              'session-winger-1',
              NOW(),
              'planned',
              NOW(),
              NOW()
            )
          `,
        ),
      );
    } finally {
      await pool.end();
    }
  });
});

test("postgres integration: reflection score columns and constraints exist in training schema", async () => {
  if (!hasTestDatabase()) {
    return;
  }

  await withIsolatedPostgresSchema(async (db) => {
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);

      const columnsResult = await pool.query(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'session_reflection'
            AND column_name IN ('understanding_score', 'independence_score')
          ORDER BY column_name
        `,
      );

      assert.deepEqual(
        columnsResult.rows.map((row) => row.column_name),
        ["independence_score", "understanding_score"],
      );

      const checkConstraints = await pool.query(
        `
          SELECT conname
          FROM pg_constraint
          WHERE conname IN (
            'session_reflection_understanding_score_check',
            'session_reflection_independence_score_check'
          )
          ORDER BY conname
        `,
      );

      assert.deepEqual(
        checkConstraints.rows.map((row) => row.conname),
        [
          "session_reflection_independence_score_check",
          "session_reflection_understanding_score_check",
        ],
      );
    } finally {
      await pool.end();
    }
  });
});
