import type { EducationContentRepository } from "@/domains/academy/repositories/EducationContentRepository";
import { validateEducationContent } from "../../../domains/academy/validation/validateEducationContent";
import { academyContent } from "../../../data/academyContent";

const content = academyContent;

validateEducationContent(content);

export const localEducationContentRepository: EducationContentRepository = {
  getPrograms: () => content.programs,
  getProgram: (id) =>
    content.programs.find((program) => program.id === id) ?? null,
  getQuestions: () => content.learningQuestions,
  getQuestion: (id) =>
    content.learningQuestions.find((question) => question.id === id) ?? null,
  getThemes: () => content.themes,
  getTheme: (id) => content.themes.find((theme) => theme.id === id) ?? null,
  getBlocks: () => content.educationBlocks,
  getBlock: (id) =>
    content.educationBlocks.find((block) => block.id === id) ?? null,
  getSessionTemplates: () => content.sessionTemplates,
  getSessionTemplate: (id) =>
    content.sessionTemplates.find((session) => session.id === id) ?? null,
  getExercises: () => content.exercises,
  getExercise: (id) =>
    content.exercises.find((exercise) => exercise.id === id) ?? null,
};
