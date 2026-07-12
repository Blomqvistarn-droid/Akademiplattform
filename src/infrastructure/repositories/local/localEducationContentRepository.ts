import type { EducationContentRepository } from "@/domains/academy/repositories/EducationContentRepository";
import {
  blocks,
  exercises,
  getBlock,
  getExercise,
  getSession,
  questions,
  sessions,
} from "@/data/content";

export const localEducationContentRepository: EducationContentRepository = {
  getQuestions: () => questions,
  getBlocks: () => blocks,
  getSessions: () => sessions,
  getExercises: () => exercises,
  getBlock,
  getSession,
  getExercise,
};
