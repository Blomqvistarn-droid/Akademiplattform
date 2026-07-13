import type { EducationBlock } from "@/domains/academy/entities/EducationBlock";
import type { EducationProgram } from "@/domains/academy/entities/EducationProgram";
import type { LearningQuestion } from "@/domains/academy/entities/LearningQuestion";
import type { Theme } from "@/domains/academy/entities/Theme";
import type { EducationContentRepository } from "@/domains/academy/repositories/EducationContentRepository";

export interface ThemeStructure {
  readonly theme: Theme;
  readonly blocks: readonly EducationBlock[];
}

export interface QuestionStructure {
  readonly question: LearningQuestion;
  readonly themes: readonly ThemeStructure[];
}

export interface ProgramStructure {
  readonly program: EducationProgram;
  readonly questions: readonly QuestionStructure[];
}

export function getProgramStructures(
  repository: EducationContentRepository,
): Promise<readonly ProgramStructure[]> {
  return buildProgramStructures(repository);
}

async function buildProgramStructures(
  repository: EducationContentRepository,
): Promise<readonly ProgramStructure[]> {
  const questions = await repository.getQuestions();
  const themes = await repository.getThemes();
  const blocks = await repository.getBlocks();

  const programs = await repository.getPrograms();

  return programs.map((program) => ({
    program,
    questions: questions
      .filter((question) => question.programId === program.id)
      .map((question) => ({
        question,
        themes: themes
          .filter((theme) => theme.learningQuestionId === question.id)
          .map((theme) => ({
            theme,
            blocks: blocks.filter((block) => block.themeId === theme.id),
          })),
      })),
  }));
}
