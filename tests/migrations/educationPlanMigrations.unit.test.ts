import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";

interface MigrationLike {
  up: (pgm: MockPgm) => void;
  down: (pgm: MockPgm) => void;
}

interface MockPgm {
  createTable: (...args: unknown[]) => void;
  addConstraint: (...args: unknown[]) => void;
  createIndex: (...args: unknown[]) => void;
  dropTable: (...args: unknown[]) => void;
}

function loadMigration(fileName: string): MigrationLike {
  return require(path.join(process.cwd(), "migrations", fileName)) as MigrationLike;
}

test("migration 000005 education plan foundation: defines up and down operations", () => {
  const migration = loadMigration("000005_education_plan_foundation.js");

  const calls: Array<{ method: string; args: unknown[] }> = [];
  const pgm: MockPgm = {
    createTable: (...args) => calls.push({ method: "createTable", args }),
    addConstraint: (...args) => calls.push({ method: "addConstraint", args }),
    createIndex: (...args) => calls.push({ method: "createIndex", args }),
    dropTable: (...args) => calls.push({ method: "dropTable", args }),
  };

  migration.up(pgm);
  migration.down(pgm);

  assert.equal(
    calls.filter((call) => call.method === "createTable").length,
    3,
  );
  assert.ok(calls.some((call) => call.method === "createIndex"));
  assert.equal(
    calls.filter((call) => call.method === "dropTable").length,
    3,
  );
});