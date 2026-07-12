import type {
  EducationBlockId,
  SessionTemplateId,
  ThemeId,
} from "@/domains/shared/types/ids";

export interface EducationBlock {
  id: EducationBlockId;
  themeId: ThemeId;
  title: string;
  level: 1 | 2 | 3;
  description: string;
  desiredBehaviours: string[];
  sessionTemplateIds: SessionTemplateId[];
}
