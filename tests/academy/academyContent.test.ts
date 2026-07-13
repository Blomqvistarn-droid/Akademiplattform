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

test("academy content preserves known IDs and ordering", () => {
  assert.equal(academyContent.programs[0].id, "program-7v7");
  assert.equal(academyContent.learningQuestions[0].id, "Q1");
  assert.equal(academyContent.themes[0].id, "theme-Q1");
  assert.equal(academyContent.educationBlocks[0].id, "block-spelbarhet");
  assert.equal(academyContent.sessionTemplates[0].id, "session-spelbarhet-1");
  assert.equal(academyContent.exercises[0].id, "ex-2v1-standard");
});

test("academy content passes validation", () => {
  assert.doesNotThrow(() => validateEducationContent(academyContent));
});
