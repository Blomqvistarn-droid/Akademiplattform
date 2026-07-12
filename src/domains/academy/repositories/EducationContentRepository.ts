import type {
  EducationBlock,
  Exercise,
  GuidingQuestion,
  Session,
} from "@/types/education";

export interface EducationContentRepository {
  getQuestions(): readonly GuidingQuestion[];
  getBlocks(): readonly EducationBlock[];
  getSessions(): readonly Session[];
  getExercises(): readonly Exercise[];
  getBlock(id: string): EducationBlock | undefined;
  getSession(id: string): Session | undefined;
  getExercise(id: string): Exercise | undefined;
}
