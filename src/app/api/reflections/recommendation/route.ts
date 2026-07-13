import { NextResponse } from "next/server";
import {
  ApplicationError,
  getApplicationErrorStatus,
} from "../../../../application/errors/ApplicationError";
import { getRecommendationHandler } from "../../../../application/reflection/handlers/getRecommendationHandler";
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

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const organizationId = getOrganizationId(request);
    const dependencies = createRequestRuntimeDependencies(organizationId);
    const unitOfWork = createTrainingUnitOfWork({
      transactionRunner: dependencies.transactionRunner,
      trainingRepository: dependencies.trainingRepository,
    });

    const url = new URL(request.url);
    const scheduledSessionId = url.searchParams.get("scheduledSessionId") ?? "";

    const recommendation = await getRecommendationHandler(unitOfWork, {
      scheduledSessionId,
    });

    return NextResponse.json(recommendation, { status: 200 });
  } catch (error) {
    return asErrorResponse(error);
  }
}
