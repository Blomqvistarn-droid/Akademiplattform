import type {
  EducationBlockId,
  TeamId,
  TeamProgressId,
} from "@/domains/shared/types/ids";

export interface TeamProgress {
  id: TeamProgressId;
  teamId: TeamId;
  educationBlockId: EducationBlockId;
  completedSessionCount: number;
  updatedAt: string;
}
