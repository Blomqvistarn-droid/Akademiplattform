import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../errors/ApplicationError";
import type { CreateTrainingCommand } from "../commands/CreateTrainingCommand";
import type { TrainingDto } from "../dto/TrainingDto";
import { mapScheduledSessionToDto } from "./trainingMapper";
import {
  assertIsoDate,
  assertNonEmptyString,
  mapRepositoryError,
} from "./trainingValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";
import { toSessionTemplateId } from "../../../domains/academy/types/ids";

export async function createTrainingHandler(
  unitOfWork: TrainingUnitOfWork,
  command: CreateTrainingCommand,
): Promise<TrainingDto> {
  try {
    assertNonEmptyString(command.teamId, "teamId");
    assertNonEmptyString(command.sessionTemplateId, "sessionTemplateId");
    assertNonEmptyString(command.scheduledAt, "scheduledAt");
    assertIsoDate(command.scheduledAt, "scheduledAt");

    return unitOfWork.execute(async ({ trainingRepository }) => {
      const created = await trainingRepository.createScheduledSession({
        id: randomUUID(),
        teamId: command.teamId,
        sessionTemplateId: toSessionTemplateId(command.sessionTemplateId),
        scheduledAt: new Date(command.scheduledAt).toISOString(),
      });

      return mapScheduledSessionToDto(created);
    });
  } catch (error) {
    throw error instanceof ApplicationError ? error : mapRepositoryError(error);
  }
}
