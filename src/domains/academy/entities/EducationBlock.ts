import type {
  EducationBlockId,
  ThemeId,
} from "@/domains/academy/types/ids";

export interface EducationBlock {
  id: EducationBlockId;
  themeId: ThemeId;
  title: string;
  level: 1 | 2 | 3;
  description: string;
  desiredBehaviours: string[];
}
