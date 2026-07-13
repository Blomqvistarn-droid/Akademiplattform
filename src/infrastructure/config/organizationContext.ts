import {
  createOrganizationContext,
  type OrganizationContext,
} from "../../application/context/OrganizationContext";
import type { OrganizationId } from "../../domains/shared/types/ids";

export function readOrganizationContextFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): OrganizationContext {
  const organizationId = env.ORGANIZATION_ID;

  if (!organizationId) {
    throw new Error(
      "Missing ORGANIZATION_ID. Organization-scoped operations require explicit scope.",
    );
  }

  return createOrganizationContext(organizationId as OrganizationId);
}
