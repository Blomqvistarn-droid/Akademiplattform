import assert from "node:assert/strict";
import test from "node:test";
import { academyContent } from "../../src/data/academyContent";
import { validateEducationContent } from "../../src/domains/academy/validation/validateEducationContent";

test("academy content has expected entity counts", () => {
  assert.equal(academyContent.programs.length, 1);
  assert.equal(academyContent.learningQuestions.length, 6);
  assert.equal(academyContent.themes.length, 6);
  assert.equal(academyContent.educationBlocks.length, 3);
  assert.equal(academyContent.sessionTemplates.length, 6);
  assert.equal(academyContent.exercises.length, 6);
});

test("academy content preserves deterministic ordering fingerprints", () => {
  assert.deepEqual(
    academyContent.programs.map((program) => program.id),
    ["program-7v7"],
  );
  assert.deepEqual(
    academyContent.learningQuestions.map((question) => question.id),
    ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
  );
  assert.deepEqual(
    academyContent.themes.map((theme) => theme.id),
    ["theme-Q1", "theme-Q2", "theme-Q3", "theme-Q4", "theme-Q5", "theme-Q6"],
  );
  assert.deepEqual(
    academyContent.educationBlocks.map((block) => block.id),
    ["block-spelbarhet", "block-winger", "block-striker"],
  );
  assert.deepEqual(
    academyContent.sessionTemplates.map((session) => session.id),
    [
      "session-spelbarhet-1",
      "session-winger-1",
      "session-winger-2",
      "session-winger-3",
      "session-winger-4",
      "session-striker-1",
    ],
  );
  assert.deepEqual(
    academyContent.exercises.map((exercise) => exercise.id),
    [
      "ex-2v1-standard",
      "ex-4v1",
      "ex-buildout-winger",
      "ex-pattern-winger",
      "ex-5v5-four-goals",
      "ex-back-pressure",
    ],
  );
});

test("all IDs are unique within each entity collection", () => {
  const collections = [
    ["programs", academyContent.programs],
    ["learningQuestions", academyContent.learningQuestions],
    ["themes", academyContent.themes],
    ["educationBlocks", academyContent.educationBlocks],
    ["sessionTemplates", academyContent.sessionTemplates],
    ["exercises", academyContent.exercises],
  ] as const;

  for (const [name, items] of collections) {
    const ids = items.map((item) => item.id);
    assert.equal(
      new Set(ids).size,
      ids.length,
      `Expected unique IDs in ${name}`,
    );
  }
});

test("academy domain references are consistent and unbroken", () => {
  const programIds = new Set(academyContent.programs.map((program) => program.id));
  const questionIds = new Set(
    academyContent.learningQuestions.map((question) => question.id),
  );
  const themeIds = new Set(academyContent.themes.map((theme) => theme.id));
  const blockIds = new Set(academyContent.educationBlocks.map((block) => block.id));
  const exerciseIds = new Set(academyContent.exercises.map((exercise) => exercise.id));

  for (const question of academyContent.learningQuestions) {
    assert.ok(
      programIds.has(question.programId),
      `LearningQuestion ${question.id} has missing program ${question.programId}`,
    );
  }

  for (const theme of academyContent.themes) {
    assert.ok(
      questionIds.has(theme.learningQuestionId),
      `Theme ${theme.id} has missing question ${theme.learningQuestionId}`,
    );
  }

  for (const block of academyContent.educationBlocks) {
    assert.ok(
      themeIds.has(block.themeId),
      `EducationBlock ${block.id} has missing theme ${block.themeId}`,
    );
  }

  for (const session of academyContent.sessionTemplates) {
    assert.ok(
      blockIds.has(session.blockId),
      `SessionTemplate ${session.id} has missing block ${session.blockId}`,
    );

    for (const part of session.parts) {
      assert.ok(
        exerciseIds.has(part.exerciseId),
        `SessionTemplate ${session.id} has missing exercise ${part.exerciseId}`,
      );
    }
  }
});

test("academy content passes strict validation rules", () => {
  assert.doesNotThrow(() => validateEducationContent(academyContent));
});
