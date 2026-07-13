import { NextResponse } from "next/server";
import {
  ApplicationError,
  getApplicationErrorStatus,
} from "../../../../application/errors/ApplicationError";
import { getReflectionHandler } from "../../../../application/reflection/handlers/getReflectionHandler";
import { createTrainingUnitOfWork } from "../../../../application/unitOfWork/createTrainingUnitOfWork";
import { createRequestRuntimeDependencies } from "../../../../composition/createRequestRuntimeDependencies";

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

export async function GET(
  request: Request,
  context: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const organizationId = getOrganizationId(request);
    const dependencies = createRequestRuntimeDependencies(organizationId);
    const unitOfWork = createTrainingUnitOfWork({
      transactionRunner: dependencies.transactionRunner,
      trainingRepository: dependencies.trainingRepository,
    });

    const reflection = await getReflectionHandler(unitOfWork, { id: context.params.id });
    return NextResponse.json(reflection, { status: 200 });
  } catch (error) {
    return asErrorResponse(error);
  }
}
