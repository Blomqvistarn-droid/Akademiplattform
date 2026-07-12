import type { EducationBlock } from "@/domains/academy/entities/EducationBlock";
import type { EducationProgram } from "@/domains/academy/entities/EducationProgram";
import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { LearningQuestion } from "@/domains/academy/entities/LearningQuestion";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import type { Theme } from "@/domains/academy/entities/Theme";
import type {
  EducationBlockId,
  EducationProgramId,
  ExerciseId,
  LearningQuestionId,
  SessionTemplateId,
  ThemeId,
} from "@/domains/shared/types/ids";

export interface EducationContentRepository {
  getPrograms(): readonly EducationProgram[];
  getProgram(id: EducationProgramId): EducationProgram | null;
  getQuestions(): readonly LearningQuestion[];
  getQuestion(id: LearningQuestionId): LearningQuestion | null;
  getThemes(): readonly Theme[];
  getTheme(id: ThemeId): Theme | null;
  getBlocks(): readonly EducationBlock[];
  getBlock(id: EducationBlockId): EducationBlock | null;
  getSessionTemplates(): readonly SessionTemplate[];
  getSessionTemplate(id: SessionTemplateId): SessionTemplate | null;
  getExercises(): readonly Exercise[];
  getExercise(id: ExerciseId): Exercise | null;
}
