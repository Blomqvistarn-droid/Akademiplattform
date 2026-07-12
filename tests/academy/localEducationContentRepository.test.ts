import assert from "node:assert/strict";
import test from "node:test";
import { localEducationContentRepository as repository } from "../../src/infrastructure/repositories/local/localEducationContentRepository";

test("repository returns known academy entities", () => {
  assert.equal(repository.getProgram("program-7v7")?.id, "program-7v7");
  assert.equal(repository.getQuestion("Q1")?.id, "Q1");
  assert.equal(repository.getTheme("theme-Q1")?.id, "theme-Q1");
  assert.equal(repository.getBlock("block-winger")?.id, "block-winger");
  assert.equal(
    repository.getSessionTemplate("session-winger-1")?.id,
    "session-winger-1",
  );
  assert.equal(
    repository.getExercise("ex-2v1-standard")?.id,
    "ex-2v1-standard",
  );
});

test("repository returns null for unknown IDs", () => {
  assert.equal(repository.getProgram("missing"), null);
  assert.equal(repository.getQuestion("missing"), null);
  assert.equal(repository.getTheme("missing"), null);
  assert.equal(repository.getBlock("missing"), null);
  assert.equal(repository.getSessionTemplate("missing"), null);
  assert.equal(repository.getExercise("missing"), null);
});
