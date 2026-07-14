import assert from "node:assert/strict";
import test from "node:test";
import { getProgramStructures } from "../../src/domains/academy/queries/getProgramStructures";
import { localEducationContentRepository as repository } from "../../src/infrastructure/repositories/local/localEducationContentRepository";

test("program journey has a complete path from program to pass", async () => {
  const structures = await getProgramStructures(repository);
  const sessions = await repository.getSessionTemplates();

  assert.ok(structures.length > 0);

  const blocks = structures.flatMap(({ questions }) =>
    questions.flatMap(({ themes }) => themes.flatMap(({ blocks }) => blocks)),
  );

  assert.ok(blocks.length > 0);

  for (const { program, questions } of structures) {
    assert.ok(String(program.id).length > 0);
    assert.ok(questions.length > 0);

    for (const { question, themes } of questions) {
      assert.ok(String(question.id).length > 0);
      assert.ok(themes.length > 0);

      for (const { theme } of themes) {
        assert.ok(String(theme.id).length > 0);
      }
    }
  }

  for (const block of blocks) {
    const linkedSessions = sessions.filter((session) => session.blockId === block.id);

    assert.ok(
      linkedSessions.length > 0,
      `Expected at least one session for block ${String(block.id)}`,
    );
  }
});

test("winger path exposes all training stages for progression", async () => {
  const sessions = await repository.getSessionTemplates();
  const wingerSessions = sessions.filter((session) => session.blockId === "block-winger");

  assert.deepEqual(
    wingerSessions.map((session) => session.stage),
    ["Introduktion", "Utveckling", "Fördjupning", "Tillämpning"],
  );
});
