import type { OrganizationId } from "@/domains/shared/types/ids";

export interface Organization {
  id: OrganizationId;
  name: string;
}
