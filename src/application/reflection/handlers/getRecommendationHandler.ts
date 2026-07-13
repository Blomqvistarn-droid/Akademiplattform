import type { RecommendationDto } from "../dto/ReflectionDto";
import type { GetRecommendationQuery } from "../queries/GetRecommendationQuery";
import {
  createInsufficientDataRecommendation,
  evaluateRecommendation,
} from "./recommendationService";
import { assertNonEmptyString } from "./reflectionValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function getRecommendationHandler(
  unitOfWork: TrainingUnitOfWork,
  query: GetRecommendationQuery,
): Promise<RecommendationDto> {
  assertNonEmptyString(query.scheduledSessionId, "scheduledSessionId");

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const reflections = await trainingRepository.getReflectionsByScheduledSession(
      query.scheduledSessionId,
    );

    if (reflections.length === 0) {
      return createInsufficientDataRecommendation(query.scheduledSessionId);
    }

    const latest = [...reflections].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    )[0];

    const evidence = {
      scheduledSessionId: query.scheduledSessionId,
      reflectionCount: reflections.length,
      latestReflectionId: String(latest.id),
      latestReflectionCreatedAt: latest.createdAt,
    };

    return evaluateRecommendation(
      latest.understandingScore,
      latest.independenceScore,
      evidence,
    );
  });
}
