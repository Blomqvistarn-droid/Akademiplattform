import type { Organization } from "@/domains/organization/entities/Organization";
import type { Team } from "@/domains/organization/entities/Team";
import type { TeamMembership } from "@/domains/organization/entities/TeamMembership";
import type { User } from "@/domains/organization/entities/User";
import type {
  OrganizationId,
  TeamId,
  UserId,
} from "@/domains/shared/types/ids";

export interface OrganizationRepository {
  getOrganizations(): readonly Organization[];
  getOrganization(id: OrganizationId): Organization | null;
  getTeams(): readonly Team[];
  getTeam(id: TeamId): Team | null;
  getUser(id: UserId): User | null;
  getMembershipsByTeam(teamId: TeamId): readonly TeamMembership[];
  getMembershipsByUser(userId: UserId): readonly TeamMembership[];
}
