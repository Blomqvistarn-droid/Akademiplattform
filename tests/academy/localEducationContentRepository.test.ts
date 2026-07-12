import assert from "node:assert/strict";
import test from "node:test";
import {
  toEducationBlockId,
  toExerciseId,
  toLearningQuestionId,
  toProgramId,
  toSessionTemplateId,
  toThemeId,
} from "../../src/domains/academy/types/ids";
import { localEducationContentRepository as repository } from "../../src/infrastructure/repositories/local/localEducationContentRepository";

test("repository returns known academy entities", () => {
  assert.equal(repository.getProgram(toProgramId("program-7v7"))?.id, "program-7v7");
  assert.equal(repository.getQuestion(toLearningQuestionId("Q1"))?.id, "Q1");
  assert.equal(repository.getTheme(toThemeId("theme-Q1"))?.id, "theme-Q1");
  assert.equal(
    repository.getBlock(toEducationBlockId("block-winger"))?.id,
    "block-winger",
  );
  assert.equal(
    repository.getSessionTemplate(toSessionTemplateId("session-winger-1"))?.id,
    "session-winger-1",
  );
  assert.equal(
    repository.getExercise(toExerciseId("ex-2v1-standard"))?.id,
    "ex-2v1-standard",
  );
});

test("repository returns null for unknown IDs", () => {
  assert.equal(repository.getProgram(toProgramId("missing")), null);
  assert.equal(repository.getQuestion(toLearningQuestionId("missing")), null);
  assert.equal(repository.getTheme(toThemeId("missing")), null);
  assert.equal(repository.getBlock(toEducationBlockId("missing")), null);
  assert.equal(
    repository.getSessionTemplate(toSessionTemplateId("missing")),
    null,
  );
  assert.equal(repository.getExercise(toExerciseId("missing")), null);
});
