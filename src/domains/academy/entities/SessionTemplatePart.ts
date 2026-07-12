import type { ExerciseId } from "@/domains/shared/types/ids";

export interface SessionTemplatePart {
  exerciseId: ExerciseId;
  duration: number;
  focus: string;
  optional?: boolean;
}
