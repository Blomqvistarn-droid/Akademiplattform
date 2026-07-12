import type {
  EducationBlockId,
  SessionTemplateId,
} from "@/domains/shared/types/ids";
import type { SessionTemplatePart } from "./SessionTemplatePart";

export type SessionStage =
  | "Introduktion"
  | "Utveckling"
  | "Fördjupning"
  | "Tillämpning";

export interface SessionTemplate {
  id: SessionTemplateId;
  title: string;
  blockId: EducationBlockId;
  stage: SessionStage;
  duration: number;
  players: string;
  keyMessage: string;
  objectives: string[];
  parts: SessionTemplatePart[];
  reflectionQuestions: string[];
}
