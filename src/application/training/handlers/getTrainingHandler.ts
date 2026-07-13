import { ApplicationError } from "../../errors/ApplicationError";
import type { TrainingDto } from "../dto/TrainingDto";
import { mapScheduledSessionToDto } from "./trainingMapper";
import { assertNonEmptyString } from "./trainingValidation";
import type { GetTrainingQuery } from "../queries/GetTrainingQuery";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function getTrainingHandler(
  unitOfWork: TrainingUnitOfWork,
  query: GetTrainingQuery,
): Promise<TrainingDto> {
  assertNonEmptyString(query.id, "id");

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const training = await trainingRepository.getScheduledSession(query.id);

    if (!training) {
      throw new ApplicationError("NotFound", "Training was not found in organization scope.");
    }

    return mapScheduledSessionToDto(training);
  });
}
