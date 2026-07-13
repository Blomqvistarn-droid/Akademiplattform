import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";

interface MigrationLike {
  up: (pgm: MockPgm) => void;
  down: (pgm: MockPgm) => void;
}

interface MockPgm {
  addColumn: (...args: unknown[]) => void;
  addConstraint: (...args: unknown[]) => void;
  dropConstraint: (...args: unknown[]) => void;
  dropColumns: (...args: unknown[]) => void;
}

function loadMigration(fileName: string): MigrationLike {
  // Using process.cwd keeps the path stable when tests run from dist/test.
  return require(path.join(process.cwd(), "migrations", fileName)) as MigrationLike;
}

test("migration 000003 reflection scores: defines up and down operations", () => {
  const migration = loadMigration("000003_reflection_scores.js");

  const calls: Array<{ method: string; args: unknown[] }> = [];
  const pgm: MockPgm = {
    addColumn: (...args) => calls.push({ method: "addColumn", args }),
    addConstraint: (...args) => calls.push({ method: "addConstraint", args }),
    dropConstraint: (...args) => calls.push({ method: "dropConstraint", args }),
    dropColumns: (...args) => calls.push({ method: "dropColumns", args }),
  };

  migration.up(pgm);
  migration.down(pgm);

  assert.ok(calls.some((call) => call.method === "addColumn"));
  assert.ok(calls.some((call) => call.method === "addConstraint"));
  assert.ok(calls.some((call) => call.method === "dropConstraint"));
  assert.ok(calls.some((call) => call.method === "dropColumns"));
});

test("migration 000004 reflection uniqueness: defines up and down operations", () => {
  const migration = loadMigration("000004_reflection_session_uniqueness.js");

  const calls: Array<{ method: string; args: unknown[] }> = [];
  const pgm: MockPgm = {
    addColumn: (...args) => calls.push({ method: "addColumn", args }),
    addConstraint: (...args) => calls.push({ method: "addConstraint", args }),
    dropConstraint: (...args) => calls.push({ method: "dropConstraint", args }),
    dropColumns: (...args) => calls.push({ method: "dropColumns", args }),
  };

  migration.up(pgm);
  migration.down(pgm);

  assert.equal(
    calls.filter((call) => call.method === "addConstraint").length,
    1,
  );
  assert.equal(
    calls.filter((call) => call.method === "dropConstraint").length,
    1,
  );
});
