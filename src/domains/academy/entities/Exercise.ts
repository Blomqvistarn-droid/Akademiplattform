import type { ExerciseId } from "@/domains/academy/types/ids";

export type ActivityType =
  | "Battle Rondo"
  | "Rondo"
  | "Utbrytsspel"
  | "Mönsterspel"
  | "Positionsspel"
  | "Smålagsspel";

export interface Exercise {
  id: ExerciseId;
  title: string;
  activityType: ActivityType;
  players: string;
  duration: number;
  area: string;
  purpose: string;
  setup: string[];
  rules: string[];
  coachingPoints: string[];
  progressions: string[];
  simplifications: string[];
  tags: string[];
}
