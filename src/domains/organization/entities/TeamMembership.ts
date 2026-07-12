import type {
  TeamId,
  TeamMembershipId,
  UserId,
} from "@/domains/shared/types/ids";

export type TeamRole = "coach" | "assistant-coach" | "member";

export interface TeamMembership {
  id: TeamMembershipId;
  teamId: TeamId;
  userId: UserId;
  role: TeamRole;
}
