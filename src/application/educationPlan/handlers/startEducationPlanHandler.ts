import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../errors/ApplicationError";
import type { StartEducationPlanCommand } from "../commands/StartEducationPlanCommand";
import type { EducationPlanDto } from "../dto/EducationPlanDto";
import type { EducationPlanUnitOfWork } from "../unitOfWork/EducationPlanUnitOfWork";
import { createEducationPlan } from "../../../domains/educationPlan/entities/EducationPlan";
import { toEducationPlanBlockId, toEducationPlanId } from "../../../domains/educationPlan/types/ids";
import { assertNonEmptyString } from "./educationPlanValidation";
import { mapEducationPlanToDto } from "./educationPlanMapper";

export async function startEducationPlanHandler(
  unitOfWork: EducationPlanUnitOfWork,
  command: StartEducationPlanCommand,
): Promise<EducationPlanDto> {
  try {
    assertNonEmptyString(command.organizationId, "organizationId");
    assertNonEmptyString(command.teamId, "teamId");

    return unitOfWork.execute(async ({ educationPlanRepository }) => {
      const timestamp = new Date().toISOString();
      const created = createEducationPlan({
        id: toEducationPlanId(randomUUID()),
        organizationId: command.organizationId,
        teamId: command.teamId,
        activeBlockId: command.activeBlockId
          ? toEducationPlanBlockId(command.activeBlockId)
          : null,
        blocks: command.blocks ?? [],
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const saved = await educationPlanRepository.saveEducationPlan(created);
      return mapEducationPlanToDto(saved);
    });
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }

    throw new ApplicationError("Validation", "Unable to start education plan.");
  }
}