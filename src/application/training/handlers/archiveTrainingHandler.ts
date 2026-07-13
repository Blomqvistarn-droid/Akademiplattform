import { ApplicationError } from "../../errors/ApplicationError";
import type { ArchiveTrainingCommand } from "../commands/ArchiveTrainingCommand";
import type { TrainingDto } from "../dto/TrainingDto";
import { mapScheduledSessionToDto } from "./trainingMapper";
import {
  assertNonEmptyString,
  mapRepositoryError,
} from "./trainingValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function archiveTrainingHandler(
  unitOfWork: TrainingUnitOfWork,
  command: ArchiveTrainingCommand,
): Promise<TrainingDto> {
  try {
    assertNonEmptyString(command.id, "id");

    return unitOfWork.execute(async ({ trainingRepository }) => {
      const archived = await trainingRepository.archiveScheduledSession(command.id);

      if (!archived) {
        throw new ApplicationError("NotFound", "Training was not found in organization scope.");
      }

      return mapScheduledSessionToDto(archived);
    });
  } catch (error) {
    throw error instanceof ApplicationError ? error : mapRepositoryError(error);
  }
}
