import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../errors/ApplicationError";
import type { SaveEducationPlanProgressDecisionCommand } from "../commands/SaveEducationPlanProgressDecisionCommand";
import type { EducationPlanDto } from "../dto/EducationPlanDto";
import type { EducationPlanUnitOfWork } from "../unitOfWork/EducationPlanUnitOfWork";
import {
  appendEducationPlanProgressEvent,
  getActiveEducationPlanBlock,
} from "../../../domains/educationPlan/entities/EducationPlan";
import {
  toEducationPlanId,
  toEducationPlanProgressId,
} from "../../../domains/educationPlan/types/ids";
import { assertNonEmptyString } from "./educationPlanValidation";
import { mapEducationPlanToDto } from "./educationPlanMapper";

const VALID_RECOMMENDATION_TYPES = new Set(["repeat", "simplify", "progress", "advance"]);
const VALID_DECISION_TYPES = new Set(["accept", "override"]);

export async function saveEducationPlanProgressDecisionHandler(
  unitOfWork: EducationPlanUnitOfWork,
  command: SaveEducationPlanProgressDecisionCommand,
): Promise<EducationPlanDto> {
  assertNonEmptyString(command.educationPlanId, "educationPlanId");
  assertNonEmptyString(command.scheduledSessionId, "scheduledSessionId");

  if (!VALID_RECOMMENDATION_TYPES.has(command.recommendationType)) {
    throw new ApplicationError("Validation", "recommendationType is invalid.");
  }

  if (!VALID_DECISION_TYPES.has(command.decisionType)) {
    throw new ApplicationError("Validation", "decisionType is invalid.");
  }

  return unitOfWork.execute(async ({ educationPlanRepository }) => {
    const plan = await educationPlanRepository.getEducationPlan(
      toEducationPlanId(command.educationPlanId),
    );

    if (!plan) {
      throw new ApplicationError(
        "NotFound",
        "Education plan was not found in organization scope.",
      );
    }

    if (plan.status === "cancelled" || plan.status === "completed") {
      throw new ApplicationError(
        "DomainRuleViolation",
        "Cannot record coach decision for a non-active education plan.",
      );
    }

    const activeBlock = getActiveEducationPlanBlock(plan);
    const completedSessionCount =
      plan.progressEvents.length > 0
        ? plan.progressEvents[plan.progressEvents.length - 1].completedSessionCount
        : 0;

    const updatedPlan = appendEducationPlanProgressEvent(plan, {
      id: toEducationPlanProgressId(randomUUID()),
      educationPlanId: plan.id,
      educationPlanBlockId: activeBlock?.id ?? null,
      teamId: plan.teamId,
      eventType: "coachDecisionRecorded",
      completedSessionCount,
      scheduledSessionId: command.scheduledSessionId,
      recommendationType: command.recommendationType,
      decisionType: command.decisionType,
      rationale: command.rationale?.trim() ? command.rationale.trim() : null,
      createdAt: new Date().toISOString(),
    });

    const saved = await educationPlanRepository.saveEducationPlan(updatedPlan);
    return mapEducationPlanToDto(saved);
  });
}
