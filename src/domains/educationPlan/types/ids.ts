declare const educationPlanIdBrand: unique symbol;

type EducationPlanIdBrand<Name extends string> = string & {
  readonly [educationPlanIdBrand]: Name;
};

export type EducationPlanId = EducationPlanIdBrand<"EducationPlanId">;
export type EducationPlanBlockId = EducationPlanIdBrand<"EducationPlanBlockId">;
export type EducationPlanProgressId = EducationPlanIdBrand<"EducationPlanProgressId">;

export const toEducationPlanId = (value: string): EducationPlanId =>
  value as EducationPlanId;

export const toEducationPlanBlockId = (value: string): EducationPlanBlockId =>
  value as EducationPlanBlockId;

export const toEducationPlanProgressId = (value: string): EducationPlanProgressId =>
  value as EducationPlanProgressId;