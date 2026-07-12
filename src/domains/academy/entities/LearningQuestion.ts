import type {
  EducationProgramId,
  LearningQuestionId,
  ThemeId,
} from "@/domains/shared/types/ids";

export interface LearningQuestion {
  id: LearningQuestionId;
  programId: EducationProgramId;
  title: string;
  description: string;
  themeIds: ThemeId[];
}
