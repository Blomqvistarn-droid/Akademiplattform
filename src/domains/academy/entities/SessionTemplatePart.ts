import type { ExerciseId } from "@/domains/academy/types/ids";

export interface SessionTemplatePart {
  exerciseId: ExerciseId;
  duration: number;
  focus: string;
  optional?: boolean;
}
