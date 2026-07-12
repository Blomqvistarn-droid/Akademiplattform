import type { ProgramId } from "@/domains/academy/types/ids";

export interface EducationProgram {
  id: ProgramId;
  title: string;
  description: string;
}
