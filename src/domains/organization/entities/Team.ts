import type {
  OrganizationId,
  TeamId,
} from "@/domains/shared/types/ids";

export interface Team {
  id: TeamId;
  organizationId: OrganizationId;
  name: string;
}
