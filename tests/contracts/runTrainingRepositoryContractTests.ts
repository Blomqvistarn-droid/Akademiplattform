import assert from "node:assert/strict";
import test from "node:test";
import type { TrainingRepository } from "@/domains/training/repositories/TrainingRepository";

export interface TrainingRepositoryContractFactory {
  createForOrganization(organizationId: string): Promise<TrainingRepository>;
}

export function runTrainingRepositoryContractTests(
  label: string,
  factory: TrainingRepositoryContractFactory,
): void {
  test(`${label}: lists scoped scheduled sessions`, async () => {
    const repository = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );

    const sessions = await repository.getScheduledSessions();

    assert.equal(sessions.length, 2);
    assert.deepEqual(
      sessions.map((session) => session.id),
      [
        "00000000-0000-0000-0000-000000001001",
        "00000000-0000-0000-0000-000000001002",
      ],
    );
  });

  test(`${label}: resolves and misses scheduled session by ID`, async () => {
    const repository = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );

    assert.equal(
      (await repository.getScheduledSession(
        "00000000-0000-0000-0000-000000001001",
      ))?.id,
      "00000000-0000-0000-0000-000000001001",
    );
    assert.equal(
      await repository.getScheduledSession(
        "00000000-0000-0000-0000-000000009999",
      ),
      null,
    );
  });

  test(`${label}: returns team reflections and session reflections`, async () => {
    const repository = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );

    const byTeam = await repository.getReflectionsByTeam(
      "00000000-0000-0000-0000-000000000101",
    );
    const bySession = await repository.getReflectionsByScheduledSession(
      "00000000-0000-0000-0000-000000001002",
    );

    assert.equal(byTeam.length, 1);
    assert.equal(bySession.length, 1);
    assert.equal(byTeam[0].id, bySession[0].id);
  });

  test(`${label}: returns team progress`, async () => {
    const repository = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );

    const progress = await repository.getProgressByTeam(
      "00000000-0000-0000-0000-000000000101",
    );

    assert.equal(progress.length, 1);
    assert.equal(progress[0].educationBlockId, "block-winger");
  });

  test(`${label}: isolates organizations`, async () => {
    const first = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );
    const second = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000002",
    );

    assert.deepEqual(
      (await first.getScheduledSessions()).map((session) => session.id),
      [
        "00000000-0000-0000-0000-000000001001",
        "00000000-0000-0000-0000-000000001002",
      ],
    );
    assert.deepEqual(
      (await second.getScheduledSessions()).map((session) => session.id),
      ["00000000-0000-0000-0000-000000001101"],
    );
  });

  async function assertReadonly(repository: TrainingRepository): Promise<void> {
    const sessions = await repository.getScheduledSessions();

    // @ts-expect-error Repository list is readonly by contract.
    sessions.push(sessions[0]);
  }

  test(`${label}: exposes readonly list typing`, async () => {
    const repository = await factory.createForOrganization(
      "00000000-0000-0000-0000-000000000001",
    );
    await assertReadonly(repository);
  });
}
