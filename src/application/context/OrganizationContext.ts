import type { OrganizationId } from "@/domains/shared/types/ids";

export interface OrganizationContext {
  organizationId: OrganizationId;
}

export function createOrganizationContext(
  organizationId: OrganizationId,
): OrganizationContext {
  if (!organizationId || organizationId.trim().length === 0) {
    throw new Error("Organization context requires a non-empty organizationId.");
  }

  return { organizationId };
}
