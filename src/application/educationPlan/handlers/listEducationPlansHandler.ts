import type { EducationPlanDto } from "../dto/EducationPlanDto";
import type { ListEducationPlansQuery } from "../queries/ListEducationPlansQuery";
import type { EducationPlanUnitOfWork } from "../unitOfWork/EducationPlanUnitOfWork";
import { assertNonEmptyString } from "./educationPlanValidation";
import { mapEducationPlanToDto } from "./educationPlanMapper";

export async function listEducationPlansHandler(
  unitOfWork: EducationPlanUnitOfWork,
  query: ListEducationPlansQuery = {},
): Promise<readonly EducationPlanDto[]> {
  if (typeof query.teamId !== "undefined") {
    assertNonEmptyString(query.teamId, "teamId");
  }

  return unitOfWork.execute(async ({ educationPlanRepository }) => {
    const plans = query.teamId
      ? await educationPlanRepository.getEducationPlansByTeam(query.teamId)
      : await educationPlanRepository.listEducationPlans();

    return plans.map(mapEducationPlanToDto);
  });
}