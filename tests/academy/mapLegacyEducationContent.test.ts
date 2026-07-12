import assert from "node:assert/strict";
import test from "node:test";
import { blocks, exercises, questions, sessions } from "../../src/data/content";
import { validateEducationContent } from "../../src/domains/academy/validation/validateEducationContent";
import {
  toEducationBlockId,
  toExerciseId,
  toLearningQuestionId,
  toProgramId,
  toThemeId,
} from "../../src/domains/academy/types/ids";
import type {
  ExerciseId,
  SessionTemplateId,
} from "../../src/domains/academy/types/ids";
import { mapLegacyEducationContent } from "../../src/infrastructure/repositories/local/mappers/mapLegacyEducationContent";

const mappedContent = mapLegacyEducationContent({
  questions,
  blocks,
  sessions,
  exercises,
});

test("maps the expected number of academy entities", () => {
  assert.equal(mappedContent.programs.length, 1);
  assert.equal(mappedContent.learningQuestions.length, 6);
  assert.equal(mappedContent.themes.length, 6);
  assert.equal(mappedContent.educationBlocks.length, 3);
  assert.equal(mappedContent.sessionTemplates.length, 6);
  assert.equal(mappedContent.exercises.length, 6);
});

test("preserves known IDs and source ordering", () => {
  assert.ok(
    mappedContent.sessionTemplates.some(
      (session) => session.id === "session-winger-1",
    ),
  );
  assert.ok(
    mappedContent.exercises.some(
      (exercise) => exercise.id === "ex-2v1-standard",
    ),
  );
  assert.deepEqual(
    mappedContent.learningQuestions.map((question) => question.id),
    questions.map((question) => question.id),
  );
  assert.deepEqual(
    mappedContent.educationBlocks.map((block) => block.id),
    blocks.map((block) => block.id),
  );
  assert.deepEqual(
    mappedContent.sessionTemplates.map((session) => session.id),
    sessions.map((session) => session.id),
  );
  assert.deepEqual(
    mappedContent.exercises.map((exercise) => exercise.id),
    exercises.map((exercise) => exercise.id),
  );
});

test("produces nominally typed academy IDs without changing their values", () => {
  const sessionId: SessionTemplateId = mappedContent.sessionTemplates[0].id;
  const exerciseId: ExerciseId = mappedContent.exercises[0].id;

  assert.equal(sessionId, sessions[0].id);
  assert.equal(exerciseId, exercises[0].id);

  // @ts-expect-error Exercise IDs must not be assignable to session template IDs.
  const invalidSessionId: SessionTemplateId = exerciseId;
  assert.equal(invalidSessionId, exerciseId);
});

test("accepts valid mapped cross-references", () => {
  assert.doesNotThrow(() => validateEducationContent(mappedContent));
});

test("rejects duplicate IDs", () => {
  assert.throws(
    () =>
      validateEducationContent({
        ...mappedContent,
        programs: [mappedContent.programs[0], mappedContent.programs[0]],
      }),
    /Duplicate ID "program-7v7" in programs/,
  );
});

test("rejects broken academy cross-references", async (context) => {
  await context.test("question to program", () => {
    assert.throws(
      () =>
        validateEducationContent({
          ...mappedContent,
          learningQuestions: [
            {
              ...mappedContent.learningQuestions[0],
              programId: toProgramId("missing"),
            },
          ],
        }),
      /LearningQuestion .* references missing ID "missing"/,
    );
  });

  await context.test("theme to question", () => {
    assert.throws(
      () =>
        validateEducationContent({
          ...mappedContent,
          themes: [
            {
              ...mappedContent.themes[0],
              learningQuestionId: toLearningQuestionId("missing"),
            },
          ],
        }),
      /Theme .* references missing ID "missing"/,
    );
  });

  await context.test("block to theme", () => {
    assert.throws(
      () =>
        validateEducationContent({
          ...mappedContent,
          educationBlocks: [
            {
              ...mappedContent.educationBlocks[0],
              themeId: toThemeId("missing"),
            },
          ],
        }),
      /EducationBlock .* references missing ID "missing"/,
    );
  });

  await context.test("session to block", () => {
    assert.throws(
      () =>
        validateEducationContent({
          ...mappedContent,
          sessionTemplates: [
            {
              ...mappedContent.sessionTemplates[0],
              blockId: toEducationBlockId("missing"),
            },
          ],
        }),
      /SessionTemplate .* references missing ID "missing"/,
    );
  });

  await context.test("session part to exercise", () => {
    const session = mappedContent.sessionTemplates[0];
    assert.throws(
      () =>
        validateEducationContent({
          ...mappedContent,
          sessionTemplates: [
            {
              ...session,
              parts: [
                { ...session.parts[0], exerciseId: toExerciseId("missing") },
              ],
            },
          ],
        }),
      /SessionTemplate .* part references missing ID "missing"/,
    );
  });
});
