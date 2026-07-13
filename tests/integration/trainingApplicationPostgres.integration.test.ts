import assert from "node:assert/strict";
import test from "node:test";
import { createOrganizationContext } from "../../src/application/context/OrganizationContext";
import { createTrainingHandler } from "../../src/application/training/handlers/createTrainingHandler";
import { getTrainingHandler } from "../../src/application/training/handlers/getTrainingHandler";
import { listTrainingsHandler } from "../../src/application/training/handlers/listTrainingsHandler";
import { createTrainingUnitOfWork } from "../../src/application/unitOfWork/createTrainingUnitOfWork";
import { createPostgresTrainingRepository } from "../../src/infrastructure/repositories/database/postgresTrainingRepository";
import { PostgresTransactionRunner } from "../../src/infrastructure/transactions/PostgresTransactionRunner";
import { toSessionTemplateId } from "../../src/domains/academy/types/ids";
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
  test("training application postgres integration skipped without TEST_DATABASE_URL", {
    skip: true,
  }, () => {});
} else {
  test("training application: create/list/get and organization isolation", async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);
      await seedTrainingReferenceData(pool);

      const org1Dependencies = {
        transactionRunner: new PostgresTransactionRunner(pool),
        trainingRepository: createPostgresTrainingRepository({
          organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000001"),
          pool,
        }),
      };

      const org2Dependencies = {
        transactionRunner: new PostgresTransactionRunner(pool),
        trainingRepository: createPostgresTrainingRepository({
          organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000002"),
          pool,
        }),
      };

      const org1Uow = createTrainingUnitOfWork(org1Dependencies);
      const org2Uow = createTrainingUnitOfWork(org2Dependencies);

      const created = await createTrainingHandler(org1Uow, {
        teamId: "00000000-0000-0000-0000-000000000101",
        sessionTemplateId: "session-winger-3",
        scheduledAt: "2026-08-20T17:00:00.000Z",
      });

      const org1List = await listTrainingsHandler(org1Uow);
      const org2List = await listTrainingsHandler(org2Uow);
      const loaded = await getTrainingHandler(org1Uow, { id: created.id });

      assert.ok(org1List.some((x) => x.id === created.id));
      assert.ok(!org2List.some((x) => x.id === created.id));
      assert.equal(loaded.id, created.id);
    } finally {
      await pool.end();
      await db.dispose();
    }
  });

  test("training application: transaction rollback and commit", async () => {
    const db = await createIsolatedPostgresSchema();
    const pool = createSchemaScopedPool(db);

    try {
      await createTrainingReferenceSchema(pool);
      await seedTrainingReferenceData(pool);

      const repository = createPostgresTrainingRepository({
        organizationContext: createOrganizationContext("00000000-0000-0000-0000-000000000001"),
        pool,
      });
      const runner = new PostgresTransactionRunner(pool);

      const before = await repository.getScheduledSessions();

      await assert.rejects(async () => {
        await runner.executeInTransaction(async () => {
          await repository.createScheduledSession({
            id: "00000000-0000-0000-0000-000000001777",
            teamId: "00000000-0000-0000-0000-000000000101",
            sessionTemplateId: toSessionTemplateId("session-winger-4"),
            scheduledAt: "2026-08-30T17:00:00.000Z",
          });
          throw new Error("force rollback");
        });
      });

      const afterRollback = await repository.getScheduledSessions();
      assert.equal(afterRollback.length, before.length);

      await runner.executeInTransaction(async () => {
        await repository.createScheduledSession({
          id: "00000000-0000-0000-0000-000000001778",
          teamId: "00000000-0000-0000-0000-000000000101",
          sessionTemplateId: toSessionTemplateId("session-winger-4"),
          scheduledAt: "2026-08-30T18:00:00.000Z",
        });
      });

      const afterCommit = await repository.getScheduledSessions();
      assert.equal(afterCommit.length, before.length + 1);
    } finally {
      await pool.end();
      await db.dispose();
    }
  });
}
