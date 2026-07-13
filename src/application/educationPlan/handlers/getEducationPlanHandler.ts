import { ApplicationError } from "../../errors/ApplicationError";
import type { EducationPlanDto } from "../dto/EducationPlanDto";
import type { GetEducationPlanQuery } from "../queries/GetEducationPlanQuery";
import type { EducationPlanUnitOfWork } from "../unitOfWork/EducationPlanUnitOfWork";
import { toEducationPlanId } from "../../../domains/educationPlan/types/ids";
import { assertNonEmptyString } from "./educationPlanValidation";
import { mapEducationPlanToDto } from "./educationPlanMapper";

export async function getEducationPlanHandler(
  unitOfWork: EducationPlanUnitOfWork,
  query: GetEducationPlanQuery,
): Promise<EducationPlanDto> {
  assertNonEmptyString(query.id, "id");

  return unitOfWork.execute(async ({ educationPlanRepository }) => {
    const plan = await educationPlanRepository.getEducationPlan(toEducationPlanId(query.id));

    if (!plan) {
      throw new ApplicationError(
        "NotFound",
        "Education plan was not found in organization scope.",
      );
    }

    return mapEducationPlanToDto(plan);
  });
}