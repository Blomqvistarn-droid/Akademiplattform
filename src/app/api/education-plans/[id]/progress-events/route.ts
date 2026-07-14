import { NextResponse } from "next/server";
import {
  ApplicationError,
  getApplicationErrorStatus,
} from "../../../../../application/errors/ApplicationError";
import type { SaveEducationPlanProgressDecisionCommand } from "../../../../../application/educationPlan/commands/SaveEducationPlanProgressDecisionCommand";
import { saveEducationPlanProgressDecisionHandler } from "../../../../../application/educationPlan/handlers/saveEducationPlanProgressDecisionHandler";
import { createEducationPlanUnitOfWork } from "../../../../../application/educationPlan/unitOfWork/createEducationPlanUnitOfWork";
import { createRequestRuntimeDependencies } from "../../../../../composition/createRequestRuntimeDependencies";

function getOrganizationId(request: Request): string {
  const organizationId = request.headers.get("x-organization-id")?.trim();

  if (!organizationId) {
    throw new ApplicationError(
      "Validation",
      "x-organization-id header is required.",
    );
  }

  return organizationId;
}

function asErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApplicationError) {
    return NextResponse.json(
      { error: error.category, message: error.message },
      { status: getApplicationErrorStatus(error) },
    );
  }

  return NextResponse.json(
    { error: "InfrastructureFailure", message: "Unexpected failure." },
    { status: 500 },
  );
}

export async function POST(
  request: Request,
  context: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const organizationId = getOrganizationId(request);
    const dependencies = createRequestRuntimeDependencies(organizationId);
    const unitOfWork = createEducationPlanUnitOfWork({
      transactionRunner: dependencies.transactionRunner,
      educationPlanRepository: dependencies.educationPlanRepository,
    });

    const payload = (await request.json()) as Omit<
      SaveEducationPlanProgressDecisionCommand,
      "educationPlanId"
    >;

    const updatedPlan = await saveEducationPlanProgressDecisionHandler(unitOfWork, {
      educationPlanId: context.params.id,
      ...payload,
    });

    return NextResponse.json(updatedPlan, { status: 201 });
  } catch (error) {
    return asErrorResponse(error);
  }
}
