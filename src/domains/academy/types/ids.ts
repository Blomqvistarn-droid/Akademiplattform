declare const academyIdBrand: unique symbol;

type AcademyId<Name extends string> = string & {
  readonly [academyIdBrand]: Name;
};

export type ProgramId = AcademyId<"ProgramId">;
export type LearningQuestionId = AcademyId<"LearningQuestionId">;
export type ThemeId = AcademyId<"ThemeId">;
export type EducationBlockId = AcademyId<"EducationBlockId">;
export type SessionTemplateId = AcademyId<"SessionTemplateId">;
export type ExerciseId = AcademyId<"ExerciseId">;

export const toProgramId = (value: string): ProgramId => value as ProgramId;

export const toLearningQuestionId = (value: string): LearningQuestionId =>
  value as LearningQuestionId;

export const toThemeId = (value: string): ThemeId => value as ThemeId;

export const toEducationBlockId = (value: string): EducationBlockId =>
  value as EducationBlockId;

export const toSessionTemplateId = (value: string): SessionTemplateId =>
  value as SessionTemplateId;

export const toExerciseId = (value: string): ExerciseId => value as ExerciseId;
