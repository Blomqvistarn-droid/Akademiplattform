import type {
  EducationProgramId,
  LearningQuestionId,
} from "@/domains/shared/types/ids";

export interface LearningQuestion {
  id: LearningQuestionId;
  programId: EducationProgramId;
  title: string;
  description: string;
}
