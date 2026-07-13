import { ApplicationError } from "../../errors/ApplicationError";
import type { UpdateTrainingCommand } from "../commands/UpdateTrainingCommand";
import type { TrainingDto } from "../dto/TrainingDto";
import { mapScheduledSessionToDto } from "./trainingMapper";
import {
  assertIsoDate,
  assertNonEmptyString,
  assertScheduledSessionStatus,
  mapRepositoryError,
} from "./trainingValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";
import { toSessionTemplateId } from "../../../domains/academy/types/ids";

export async function updateTrainingHandler(
  unitOfWork: TrainingUnitOfWork,
  command: UpdateTrainingCommand,
): Promise<TrainingDto> {
  try {
    assertNonEmptyString(command.id, "id");

    if (command.teamId) {
      assertNonEmptyString(command.teamId, "teamId");
    }

    if (command.sessionTemplateId) {
      assertNonEmptyString(command.sessionTemplateId, "sessionTemplateId");
    }

    if (command.scheduledAt) {
      assertIsoDate(command.scheduledAt, "scheduledAt");
    }

    if (command.status) {
      assertScheduledSessionStatus(command.status);
    }

    return unitOfWork.execute(async ({ trainingRepository }) => {
      const updated = await trainingRepository.updateScheduledSession(command.id, {
        teamId: command.teamId,
        sessionTemplateId: command.sessionTemplateId
          ? toSessionTemplateId(command.sessionTemplateId)
          : undefined,
        scheduledAt: command.scheduledAt
          ? new Date(command.scheduledAt).toISOString()
          : undefined,
        status: command.status,
      });

      if (!updated) {
        throw new ApplicationError("NotFound", "Training was not found in organization scope.");
      }

      return mapScheduledSessionToDto(updated);
    });
  } catch (error) {
    throw error instanceof ApplicationError ? error : mapRepositoryError(error);
  }
}
