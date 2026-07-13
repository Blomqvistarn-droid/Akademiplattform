import { NextResponse } from "next/server";
import {
  ApplicationError,
  getApplicationErrorStatus,
} from "../../../application/errors/ApplicationError";
import type { StartEducationPlanCommand } from "../../../application/educationPlan/commands/StartEducationPlanCommand";
import { getEducationPlanHandler } from "../../../application/educationPlan/handlers/getEducationPlanHandler";
import { listEducationPlansHandler } from "../../../application/educationPlan/handlers/listEducationPlansHandler";
import { startEducationPlanHandler } from "../../../application/educationPlan/handlers/startEducationPlanHandler";
import { createEducationPlanUnitOfWork } from "../../../application/educationPlan/unitOfWork/createEducationPlanUnitOfWork";
import { createRequestRuntimeDependencies } from "../../../composition/createRequestRuntimeDependencies";

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
    const unitOfWork = createEducationPlanUnitOfWork({
      transactionRunner: dependencies.transactionRunner,
      educationPlanRepository: dependencies.educationPlanRepository,
    });

    const url = new URL(request.url);
    const id = url.searchParams.get("id") ?? undefined;
    const teamId = url.searchParams.get("teamId") ?? undefined;

    if (id) {
      const plan = await getEducationPlanHandler(unitOfWork, { id });
      return NextResponse.json(plan, { status: 200 });
    }

    const plans = await listEducationPlansHandler(unitOfWork, { teamId });
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return asErrorResponse(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const organizationId = getOrganizationId(request);
    const dependencies = createRequestRuntimeDependencies(organizationId);
    const unitOfWork = createEducationPlanUnitOfWork({
      transactionRunner: dependencies.transactionRunner,
      educationPlanRepository: dependencies.educationPlanRepository,
    });

    const payload = (await request.json()) as Omit<StartEducationPlanCommand, "organizationId">;
    const created = await startEducationPlanHandler(unitOfWork, {
      ...payload,
      organizationId,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return asErrorResponse(error);
  }
}