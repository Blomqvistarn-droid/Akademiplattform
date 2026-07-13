import assert from "node:assert/strict";
import test from "node:test";
import { academyContent } from "../../src/data/academyContent";
import {
  toEducationBlockId,
  toExerciseId,
  toLearningQuestionId,
  toProgramId,
  toSessionTemplateId,
  toThemeId,
} from "../../src/domains/academy/types/ids";
import { localEducationContentRepository as repository } from "../../src/infrastructure/repositories/local/localEducationContentRepository";

test("getPrograms returns all programs in source order", () => {
  const programs = repository.getPrograms();

  assert.equal(programs.length, academyContent.programs.length);
  assert.equal(programs, academyContent.programs);
  assert.deepEqual(
    programs.map((program) => program.id),
    academyContent.programs.map((program) => program.id),
  );
});

test("getProgram resolves an existing program by ID", () => {
  const firstProgram = academyContent.programs[0];

  assert.equal(repository.getProgram(firstProgram.id), firstProgram);
});

test("getProgram returns null for unknown ID", () => {
  assert.equal(repository.getProgram(toProgramId("missing-program")), null);
});

test("getQuestions returns all questions in source order", () => {
  const questions = repository.getQuestions();

  assert.equal(questions.length, academyContent.learningQuestions.length);
  assert.equal(questions, academyContent.learningQuestions);
  assert.deepEqual(
    questions.map((question) => question.id),
    academyContent.learningQuestions.map((question) => question.id),
  );
});

test("getQuestion resolves an existing question by ID", () => {
  const firstQuestion = academyContent.learningQuestions[0];

  assert.equal(repository.getQuestion(firstQuestion.id), firstQuestion);
});

test("getQuestion returns null for unknown ID", () => {
  assert.equal(repository.getQuestion(toLearningQuestionId("missing-question")), null);
});

test("getThemes returns all themes in source order", () => {
  const themes = repository.getThemes();

  assert.equal(themes.length, academyContent.themes.length);
  assert.equal(themes, academyContent.themes);
  assert.deepEqual(
    themes.map((theme) => theme.id),
    academyContent.themes.map((theme) => theme.id),
  );
});

test("getTheme resolves an existing theme by ID", () => {
  const firstTheme = academyContent.themes[0];

  assert.equal(repository.getTheme(firstTheme.id), firstTheme);
});

test("getTheme returns null for unknown ID", () => {
  assert.equal(repository.getTheme(toThemeId("missing-theme")), null);
});

test("getBlocks returns all blocks in source order", () => {
  const blocks = repository.getBlocks();

  assert.equal(blocks.length, academyContent.educationBlocks.length);
  assert.equal(blocks, academyContent.educationBlocks);
  assert.deepEqual(
    blocks.map((block) => block.id),
    academyContent.educationBlocks.map((block) => block.id),
  );
});

test("getBlock resolves an existing block by ID", () => {
  const firstBlock = academyContent.educationBlocks[0];

  assert.equal(repository.getBlock(firstBlock.id), firstBlock);
});

test("getBlock returns null for unknown ID", () => {
  assert.equal(repository.getBlock(toEducationBlockId("missing-block")), null);
});

test("getSessionTemplates returns all session templates in source order", () => {
  const sessionTemplates = repository.getSessionTemplates();

  assert.equal(sessionTemplates.length, academyContent.sessionTemplates.length);
  assert.equal(sessionTemplates, academyContent.sessionTemplates);
  assert.deepEqual(
    sessionTemplates.map((session) => session.id),
    academyContent.sessionTemplates.map((session) => session.id),
  );
});

test("getSessionTemplate resolves an existing session template by ID", () => {
  const firstSessionTemplate = academyContent.sessionTemplates[0];

  assert.equal(
    repository.getSessionTemplate(firstSessionTemplate.id),
    firstSessionTemplate,
  );
});

test("getSessionTemplate returns null for unknown ID", () => {
  assert.equal(
    repository.getSessionTemplate(toSessionTemplateId("missing-session")),
    null,
  );
});

test("getExercises returns all exercises in source order", () => {
  const exercises = repository.getExercises();

  assert.equal(exercises.length, academyContent.exercises.length);
  assert.equal(exercises, academyContent.exercises);
  assert.deepEqual(
    exercises.map((exercise) => exercise.id),
    academyContent.exercises.map((exercise) => exercise.id),
  );
});

test("getExercise resolves an existing exercise by ID", () => {
  const firstExercise = academyContent.exercises[0];

  assert.equal(repository.getExercise(firstExercise.id), firstExercise);
});

test("getExercise returns null for unknown ID", () => {
  assert.equal(repository.getExercise(toExerciseId("missing-exercise")), null);
});

test("repository exposes the exact same aggregate counts as academyContent", () => {
  assert.equal(repository.getPrograms().length, academyContent.programs.length);
  assert.equal(
    repository.getQuestions().length,
    academyContent.learningQuestions.length,
  );
  assert.equal(repository.getThemes().length, academyContent.themes.length);
  assert.equal(
    repository.getBlocks().length,
    academyContent.educationBlocks.length,
  );
  assert.equal(
    repository.getSessionTemplates().length,
    academyContent.sessionTemplates.length,
  );
  assert.equal(
    repository.getExercises().length,
    academyContent.exercises.length,
  );
});

test("repository lookup methods resolve every ID present in academyContent", () => {
  for (const program of academyContent.programs) {
    assert.equal(repository.getProgram(program.id), program);
  }

  for (const question of academyContent.learningQuestions) {
    assert.equal(repository.getQuestion(question.id), question);
  }

  for (const theme of academyContent.themes) {
    assert.equal(repository.getTheme(theme.id), theme);
  }

  for (const block of academyContent.educationBlocks) {
    assert.equal(repository.getBlock(block.id), block);
  }

  for (const sessionTemplate of academyContent.sessionTemplates) {
    assert.equal(
      repository.getSessionTemplate(sessionTemplate.id),
      sessionTemplate,
    );
  }

  for (const exercise of academyContent.exercises) {
    assert.equal(repository.getExercise(exercise.id), exercise);
  }
});

function assertReadonlyRepositoryCollections(): void {
  const programs = repository.getPrograms();
  const questions = repository.getQuestions();

  // @ts-expect-error Repository collections are readonly.
  programs.push(academyContent.programs[0]);
  // @ts-expect-error Repository collections are readonly.
  questions.push(academyContent.learningQuestions[0]);
}

void assertReadonlyRepositoryCollections;
