import type {
  LearningQuestionId,
  ThemeId,
} from "@/domains/academy/types/ids";

export interface Theme {
  id: ThemeId;
  learningQuestionId: LearningQuestionId;
  title: string;
  description: string;
}
