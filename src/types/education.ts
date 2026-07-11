export type ActivityType =
  | "Battle Rondo"
  | "Rondo"
  | "Utbrytsspel"
  | "Mönsterspel"
  | "Positionsspel"
  | "Smålagsspel";

export interface GuidingQuestion {
  id: string;
  title: string;
  description: string;
}

export interface Exercise {
  id: string;
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

export interface SessionPart {
  exerciseId: string;
  duration: number;
  focus: string;
  optional?: boolean;
}

export interface Session {
  id: string;
  title: string;
  blockId: string;
  stage: "Introduktion" | "Utveckling" | "Fördjupning" | "Tillämpning";
  duration: number;
  players: string;
  keyMessage: string;
  objectives: string[];
  parts: SessionPart[];
  reflectionQuestions: string[];
}

export interface EducationBlock {
  id: string;
  questionId: string;
  title: string;
  level: 1 | 2 | 3;
  description: string;
  desiredBehaviours: string[];
  sessionIds: string[];
}
