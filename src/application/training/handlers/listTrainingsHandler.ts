import type { TrainingDto } from "../dto/TrainingDto";
import { mapScheduledSessionToDto } from "./trainingMapper";
import { assertNonEmptyString } from "./trainingValidation";
import type { ListTrainingsQuery } from "../queries/ListTrainingsQuery";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function listTrainingsHandler(
  unitOfWork: TrainingUnitOfWork,
  query: ListTrainingsQuery = {},
): Promise<readonly TrainingDto[]> {
  if (typeof query.teamId !== "undefined") {
    assertNonEmptyString(query.teamId, "teamId");
  }

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const trainings = await trainingRepository.getScheduledSessions();

    return trainings
      .filter((training) =>
        query.teamId ? String(training.teamId) === query.teamId : true,
      )
      .map(mapScheduledSessionToDto);
  });
}
