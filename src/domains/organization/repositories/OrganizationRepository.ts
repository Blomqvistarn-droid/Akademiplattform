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
  getOrganizations(): Promise<readonly Organization[]>;
  getOrganization(id: OrganizationId): Promise<Organization | null>;
  getTeams(): Promise<readonly Team[]>;
  getTeam(id: TeamId): Promise<Team | null>;
  getUser(id: UserId): Promise<User | null>;
  getMembershipsByTeam(teamId: TeamId): Promise<readonly TeamMembership[]>;
  getMembershipsByUser(userId: UserId): Promise<readonly TeamMembership[]>;
}
