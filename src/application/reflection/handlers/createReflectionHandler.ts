import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../errors/ApplicationError";
import type { CreateReflectionCommand } from "../commands/CreateReflectionCommand";
import type { ReflectionDto, RecommendationDto } from "../dto/ReflectionDto";
import { mapSessionReflectionToDto } from "./reflectionMapper";
import { evaluateRecommendation } from "./recommendationService";
import { assertNonEmptyString, assertScore } from "./reflectionValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export interface CreateReflectionResult {
  reflection: ReflectionDto;
  recommendation: RecommendationDto;
}

export async function createReflectionHandler(
  unitOfWork: TrainingUnitOfWork,
  command: CreateReflectionCommand,
): Promise<CreateReflectionResult> {
  assertNonEmptyString(command.scheduledSessionId, "scheduledSessionId");
  assertNonEmptyString(command.authorId, "authorId");
  assertNonEmptyString(command.notes, "notes");
  assertScore(command.understandingScore, "understandingScore");
  assertScore(command.independenceScore, "independenceScore");

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const session = await trainingRepository.getScheduledSession(command.scheduledSessionId);

    if (!session) {
      throw new ApplicationError("NotFound", "Scheduled session was not found in organization scope.");
    }

    if (session.status !== "completed") {
      throw new ApplicationError(
        "DomainRuleViolation",
        "Reflection can only be created for completed scheduled sessions.",
      );
    }

    const existingReflections = await trainingRepository.getReflectionsByScheduledSession(
      command.scheduledSessionId,
    );

    if (existingReflections.length > 0) {
      throw new ApplicationError(
        "Conflict",
        "A reflection already exists for the scheduled session in organization scope.",
      );
    }

    const createdAt = new Date().toISOString();
    const reflection = await trainingRepository.createReflection({
      id: randomUUID(),
      scheduledSessionId: command.scheduledSessionId,
      authorId: command.authorId,
      understandingScore: command.understandingScore,
      independenceScore: command.independenceScore,
      notes: command.notes,
      createdAt,
    });

    return {
      reflection: mapSessionReflectionToDto(reflection),
      recommendation: evaluateRecommendation(
        reflection.understandingScore,
        reflection.independenceScore,
        {
          scheduledSessionId: reflection.scheduledSessionId,
          reflectionCount: 1,
          latestReflectionId: String(reflection.id),
          latestReflectionCreatedAt: reflection.createdAt,
        },
      ),
    };
  });
}
