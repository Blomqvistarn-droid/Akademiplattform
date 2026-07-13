import type { EducationBlock } from "@/domains/academy/entities/EducationBlock";
import type { EducationProgram } from "@/domains/academy/entities/EducationProgram";
import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { LearningQuestion } from "@/domains/academy/entities/LearningQuestion";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import type { Theme } from "@/domains/academy/entities/Theme";
import type {
  EducationBlockId,
  ExerciseId,
  LearningQuestionId,
  ProgramId,
  SessionTemplateId,
  ThemeId,
} from "@/domains/academy/types/ids";

export interface EducationContentRepository {
  getPrograms(): Promise<readonly EducationProgram[]>;
  getProgram(id: ProgramId): Promise<EducationProgram | null>;
  getQuestions(): Promise<readonly LearningQuestion[]>;
  getQuestion(id: LearningQuestionId): Promise<LearningQuestion | null>;
  getThemes(): Promise<readonly Theme[]>;
  getTheme(id: ThemeId): Promise<Theme | null>;
  getBlocks(): Promise<readonly EducationBlock[]>;
  getBlock(id: EducationBlockId): Promise<EducationBlock | null>;
  getSessionTemplates(): Promise<readonly SessionTemplate[]>;
  getSessionTemplate(id: SessionTemplateId): Promise<SessionTemplate | null>;
  getExercises(): Promise<readonly Exercise[]>;
  getExercise(id: ExerciseId): Promise<Exercise | null>;
}
