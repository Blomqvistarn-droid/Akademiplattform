import { ApplicationError } from "../../errors/ApplicationError";
import type { ReflectionDto } from "../dto/ReflectionDto";
import type { ListReflectionsQuery } from "../queries/ListReflectionsQuery";
import { mapSessionReflectionToDto } from "./reflectionMapper";
import { assertNonEmptyString } from "./reflectionValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function listReflectionsHandler(
  unitOfWork: TrainingUnitOfWork,
  query: ListReflectionsQuery,
): Promise<readonly ReflectionDto[]> {
  const hasSession = Boolean(query.scheduledSessionId);
  const hasTeam = Boolean(query.teamId);

  if (hasSession && hasTeam) {
    throw new ApplicationError(
      "Validation",
      "Use only one filter: scheduledSessionId or teamId.",
    );
  }

  if (query.scheduledSessionId) {
    assertNonEmptyString(query.scheduledSessionId, "scheduledSessionId");
  }

  if (query.teamId) {
    assertNonEmptyString(query.teamId, "teamId");
  }

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const reflections = query.scheduledSessionId
      ? await trainingRepository.getReflectionsByScheduledSession(query.scheduledSessionId)
      : query.teamId
        ? await trainingRepository.getReflectionsByTeam(query.teamId)
        : (
            await Promise.all(
              (await trainingRepository.getScheduledSessions()).map((session) =>
                trainingRepository.getReflectionsByScheduledSession(session.id),
              ),
            )
          ).flat();

    return reflections.map(mapSessionReflectionToDto);
  });
}
