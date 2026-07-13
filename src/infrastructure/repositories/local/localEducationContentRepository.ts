import type { EducationContentRepository } from "@/domains/academy/repositories/EducationContentRepository";
import { validateEducationContent } from "../../../domains/academy/validation/validateEducationContent";
import { academyContent } from "../../../data/academyContent";

const content = academyContent;

validateEducationContent(content);

export const localEducationContentRepository: EducationContentRepository = {
  getPrograms: async () => content.programs,
  getProgram: async (id) =>
    content.programs.find((program) => program.id === id) ?? null,
  getQuestions: async () => content.learningQuestions,
  getQuestion: async (id) =>
    content.learningQuestions.find((question) => question.id === id) ?? null,
  getThemes: async () => content.themes,
  getTheme: async (id) => content.themes.find((theme) => theme.id === id) ?? null,
  getBlocks: async () => content.educationBlocks,
  getBlock: async (id) =>
    content.educationBlocks.find((block) => block.id === id) ?? null,
  getSessionTemplates: async () => content.sessionTemplates,
  getSessionTemplate: async (id) =>
    content.sessionTemplates.find((session) => session.id === id) ?? null,
  getExercises: async () => content.exercises,
  getExercise: async (id) =>
    content.exercises.find((exercise) => exercise.id === id) ?? null,
};
