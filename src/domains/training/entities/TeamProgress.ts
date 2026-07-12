import type { EducationBlockId } from "@/domains/academy/types/ids";
import type { TeamId, TeamProgressId } from "@/domains/shared/types/ids";

export interface TeamProgress {
  id: TeamProgressId;
  teamId: TeamId;
  educationBlockId: EducationBlockId;
  completedSessionCount: number;
  updatedAt: string;
}
