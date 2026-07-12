import type { EducationProgramId } from "@/domains/shared/types/ids";

export interface EducationProgram {
  id: EducationProgramId;
  title: string;
  description: string;
}
