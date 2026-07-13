import assert from "node:assert/strict";
import test from "node:test";
import { getProgramStructures } from "../../src/domains/academy/queries/getProgramStructures";
import { localEducationContentRepository as repository } from "../../src/infrastructure/repositories/local/localEducationContentRepository";

test("builds the complete academy program structure", async () => {
  const structures = await getProgramStructures(repository);

  assert.equal(structures.length, 1);
  assert.equal(structures[0].questions.length, 6);
  assert.equal(
    structures[0].questions.reduce(
      (total, question) => total + question.themes.length,
      0,
    ),
    6,
  );
  assert.equal(
    structures[0].questions.reduce(
      (total, question) =>
        total +
        question.themes.reduce(
          (themeTotal, theme) => themeTotal + theme.blocks.length,
          0,
        ),
      0,
    ),
    3,
  );
});

test("preserves repository ordering at every level", async () => {
  const structures = await getProgramStructures(repository);
  const programs = await repository.getPrograms();
  const questions = await repository.getQuestions();
  const themes = await repository.getThemes();
  const blocks = await repository.getBlocks();

  assert.deepEqual(
    structures.map(({ program }) => program.id),
    programs.map((program) => program.id),
  );
  assert.deepEqual(
    structures.flatMap(({ questions }) =>
      questions.map(({ question }) => question.id),
    ),
    questions.map((question) => question.id),
  );
  assert.deepEqual(
    structures.flatMap(({ questions }) =>
      questions.flatMap(({ themes }) => themes.map(({ theme }) => theme.id)),
    ),
    themes.map((theme) => theme.id),
  );
  assert.deepEqual(
    structures.flatMap(({ questions }) =>
      questions.flatMap(({ themes }) =>
        themes.flatMap(({ blocks }) => blocks.map((block) => block.id)),
      ),
    ),
    blocks.map((block) => block.id),
  );
});

test("groups questions, themes and blocks by their domain references", async () => {
  const structures = await getProgramStructures(repository);
  const questions = structures[0].questions;
  const q1 = questions.find(({ question }) => question.id === "Q1");
  const q4 = questions.find(({ question }) => question.id === "Q4");
  const q5 = questions.find(({ question }) => question.id === "Q5");

  assert.deepEqual(
    q1?.themes.flatMap(({ blocks }) => blocks.map((block) => block.id)),
    ["block-spelbarhet"],
  );
  assert.deepEqual(
    q4?.themes.flatMap(({ blocks }) => blocks.map((block) => block.id)),
    ["block-winger"],
  );
  assert.deepEqual(
    q5?.themes.flatMap(({ blocks }) => blocks.map((block) => block.id)),
    ["block-striker"],
  );
});
