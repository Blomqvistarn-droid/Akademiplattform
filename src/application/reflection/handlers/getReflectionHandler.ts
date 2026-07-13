import { ApplicationError } from "../../errors/ApplicationError";
import type { ReflectionDto } from "../dto/ReflectionDto";
import type { GetReflectionQuery } from "../queries/GetReflectionQuery";
import { mapSessionReflectionToDto } from "./reflectionMapper";
import { assertNonEmptyString } from "./reflectionValidation";
import type { TrainingUnitOfWork } from "../../unitOfWork/TrainingUnitOfWork";

export async function getReflectionHandler(
  unitOfWork: TrainingUnitOfWork,
  query: GetReflectionQuery,
): Promise<ReflectionDto> {
  assertNonEmptyString(query.id, "id");

  return unitOfWork.execute(async ({ trainingRepository }) => {
    const reflection = await trainingRepository.getReflection(query.id);

    if (!reflection) {
      throw new ApplicationError("NotFound", "Reflection was not found in organization scope.");
    }

    return mapSessionReflectionToDto(reflection);
  });
}
