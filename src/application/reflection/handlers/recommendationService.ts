import type {
  RecommendationDto,
  RecommendationEvidenceDto,
  RecommendationType,
} from "../dto/ReflectionDto";

function recommendationMessage(type: RecommendationType): string {
  switch (type) {
    case "simplify":
      return "Forenkla upplagget och upprepa nyckelsituationen med fler repetitioner.";
    case "repeat":
      return "Upprepa temat med samma svaarighetsgrad for att forstarka beslutsfattandet.";
    case "advance":
      return "Ga vidare till nasta progression i temat.";
    case "progress":
    default:
      return "Fortsatt inom samma tema med nagot hogre krav.";
  }
}

function recommendationRationale(type: RecommendationType): string {
  switch (type) {
    case "simplify":
      return "Laget behover mindre komplexitet for att befasta grundforstaelsen i spelmomentet.";
    case "repeat":
      return "Laget behover fler repetitioner i samma larandemal innan progression.";
    case "advance":
      return "Laget visar hog forstaelse och sjalvstandighet och kan ga vidare i progressionen.";
    case "progress":
    default:
      return "Laget ar redo for nasta steg inom temat med kontrollerad okning av komplexitet.";
  }
}

function buildRecommendation(
  type: RecommendationType,
  evidence: RecommendationEvidenceDto,
  options?: {
    isFallback?: boolean;
    fallbackReason?: string;
  },
): RecommendationDto {
  return {
    type,
    message: recommendationMessage(type),
    pedagogicalRationale: recommendationRationale(type),
    evidence,
    isFallback: options?.isFallback ?? false,
    fallbackReason: options?.fallbackReason ?? null,
  };
}

export function createInsufficientDataRecommendation(
  scheduledSessionId: string,
): RecommendationDto {
  return buildRecommendation(
    "repeat",
    {
      scheduledSessionId,
      reflectionCount: 0,
      latestReflectionId: null,
      latestReflectionCreatedAt: null,
    },
    {
      isFallback: true,
      fallbackReason:
        "Otillrackligt underlag for rekommendation. Minst en reflection behovs for en tillforlitlig rekommendation.",
    },
  );
}

export function evaluateRecommendation(
  understandingScore: number,
  independenceScore: number,
  evidence: RecommendationEvidenceDto,
): RecommendationDto {
  let type: RecommendationType;

  if (understandingScore <= 2) {
    type = "simplify";
  } else if (independenceScore <= 2) {
    type = "repeat";
  } else if (understandingScore >= 4 && independenceScore >= 4) {
    type = "advance";
  } else {
    type = "progress";
  }

  return buildRecommendation(type, evidence);
}
