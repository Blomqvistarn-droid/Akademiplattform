import type { EducationBlock } from "@/domains/academy/entities/EducationBlock";
import type { EducationProgram } from "@/domains/academy/entities/EducationProgram";
import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { LearningQuestion } from "@/domains/academy/entities/LearningQuestion";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import type { Theme } from "@/domains/academy/entities/Theme";

export interface AcademyContent {
  readonly programs: readonly EducationProgram[];
  readonly learningQuestions: readonly LearningQuestion[];
  readonly themes: readonly Theme[];
  readonly educationBlocks: readonly EducationBlock[];
  readonly sessionTemplates: readonly SessionTemplate[];
  readonly exercises: readonly Exercise[];
}

function assertUniqueIds(
  collectionName: string,
  items: readonly { readonly id: string }[],
): void {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate ID "${item.id}" in ${collectionName}`);
    }

    ids.add(item.id);
  }
}

function assertReference(
  source: string,
  target: string,
  targetIds: ReadonlySet<string>,
): void {
  if (!targetIds.has(target)) {
    throw new Error(`${source} references missing ID "${target}"`);
  }
}

export function validateEducationContent(content: AcademyContent): void {
  assertUniqueIds("programs", content.programs);
  assertUniqueIds("learningQuestions", content.learningQuestions);
  assertUniqueIds("themes", content.themes);
  assertUniqueIds("educationBlocks", content.educationBlocks);
  assertUniqueIds("sessionTemplates", content.sessionTemplates);
  assertUniqueIds("exercises", content.exercises);

  const programIds = new Set(content.programs.map((program) => program.id));
  const questionIds = new Set(
    content.learningQuestions.map((question) => question.id),
  );
  const themeIds = new Set(content.themes.map((theme) => theme.id));
  const blockIds = new Set(content.educationBlocks.map((block) => block.id));
  const exerciseIds = new Set(content.exercises.map((exercise) => exercise.id));

  for (const question of content.learningQuestions) {
    assertReference(
      `LearningQuestion "${question.id}"`,
      question.programId,
      programIds,
    );
  }

  for (const theme of content.themes) {
    assertReference(
      `Theme "${theme.id}"`,
      theme.learningQuestionId,
      questionIds,
    );
  }

  for (const block of content.educationBlocks) {
    assertReference(
      `EducationBlock "${block.id}"`,
      block.themeId,
      themeIds,
    );
  }

  for (const session of content.sessionTemplates) {
    assertReference(
      `SessionTemplate "${session.id}"`,
      session.blockId,
      blockIds,
    );

    for (const part of session.parts) {
      assertReference(
        `SessionTemplate "${session.id}" part`,
        part.exerciseId,
        exerciseIds,
      );
    }
  }
}
