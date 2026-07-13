export interface ReflectionDto {
  id: string;
  scheduledSessionId: string;
  authorId: string;
  understandingScore: number;
  independenceScore: number;
  notes: string;
  createdAt: string;
}

export type RecommendationType = "repeat" | "simplify" | "progress" | "advance";

export interface RecommendationEvidenceDto {
  scheduledSessionId: string;
  reflectionCount: number;
  latestReflectionId: string | null;
  latestReflectionCreatedAt: string | null;
}

export interface RecommendationDto {
  type: RecommendationType;
  message: string;
  pedagogicalRationale: string;
  evidence: RecommendationEvidenceDto;
  isFallback: boolean;
  fallbackReason: string | null;
}
