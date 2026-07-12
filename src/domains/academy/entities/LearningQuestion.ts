import type {
  LearningQuestionId,
  ProgramId,
} from "@/domains/academy/types/ids";

export interface LearningQuestion {
  id: LearningQuestionId;
  programId: ProgramId;
  title: string;
  description: string;
}
