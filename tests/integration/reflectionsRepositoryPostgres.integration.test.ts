import assert from "node:assert/strict";
import test from "node:test";
import { createOrganizationContext } from "../../src/application/context/OrganizationContext";
import { createPostgresTrainingRepository } from "../../src/infrastructure/repositories/database/postgresTrainingRepository";
import {
  createIsolatedPostgresSchema,
  createSchemaScopedPool,
  hasTestDatabase,
} from "./fixtures/postgresTestDatabase";
import {
  createTrainingReferenceSchema,
  seedTrainingReferenceData,
} from "./fixtures/seedTrainingReferenceAggregate";

if (!hasTestDatabase()) {
  test("reflections repository postgres integration skipped without TEST_DATABASE_URL", {
    skip: true,
  }, () => {});
} else {
  test("reflections repository: create/get/list with organization isolation", async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);
      await seedTrainingReferenceData(pool);
      await pool.query(`
        DELETE FROM session_reflection
        WHERE organization_id = '00000000-0000-0000-0000-000000000001'
          AND scheduled_session_id = '00000000-0000-0000-0000-000000001002'
      `);

      const org1Repository = createPostgresTrainingRepository({
        organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000001"),
        pool,
      });
      const org2Repository = createPostgresTrainingRepository({
        organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000002"),
        pool,
      });

      const created = await org1Repository.createReflection({
        id: "00000000-0000-0000-0000-000000002099",
        scheduledSessionId: "00000000-0000-0000-0000-000000001002",
        authorId: "00000000-0000-0000-0000-000000000201",
        understandingScore: 5,
        independenceScore: 4,
        notes: "Stabil progression.",
        createdAt: "2026-08-12T19:15:00.000Z",
      });

      const loadedOrg1 = await org1Repository.getReflection(created.id);
      const loadedOrg2 = await org2Repository.getReflection(created.id);
      const bySession = await org1Repository.getReflectionsByScheduledSession(
        "00000000-0000-0000-0000-000000001002",
      );
      const byTeam = await org1Repository.getReflectionsByTeam(
        "00000000-0000-0000-0000-000000000101",
      );

      assert.ok(loadedOrg1);
      assert.equal(loadedOrg1?.id, created.id);
      assert.equal(loadedOrg2, null);
      assert.ok(bySession.some((reflection) => reflection.id === created.id));
      assert.ok(byTeam.some((reflection) => reflection.id === created.id));

      await assert.rejects(() =>
        org1Repository.createReflection({
          id: "00000000-0000-0000-0000-000000002299",
          scheduledSessionId: "00000000-0000-0000-0000-000000001002",
          authorId: "00000000-0000-0000-0000-000000000201",
          understandingScore: 4,
          independenceScore: 4,
          notes: "Dublett.",
          createdAt: "2026-08-12T19:20:00.000Z",
        }),
      );
    } finally {
      await pool.end();
      await db.dispose();
    }
  });

  test("reflections repository: score constraints reject out-of-range values", async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);
      await seedTrainingReferenceData(pool);

      const repository = createPostgresTrainingRepository({
        organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000001"),
        pool,
      });

      await assert.rejects(() =>
        repository.createReflection({
          id: "00000000-0000-0000-0000-000000002199",
          scheduledSessionId: "00000000-0000-0000-0000-000000001002",
          authorId: "00000000-0000-0000-0000-000000000201",
          understandingScore: 6,
          independenceScore: 3,
          notes: "Ogiltigt scorefall.",
          createdAt: "2026-08-12T19:16:00.000Z",
        }),
      );
    } finally {
      await pool.end();
      await db.dispose();
    }
  });

}
