import { ApplicationError } from "../../errors/ApplicationError";

export function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApplicationError("Validation", `${field} is required.`);
  }
}

export function assertScore(value: number, field: string): void {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new ApplicationError("Validation", `${field} must be an integer between 1 and 5.`);
  }
}

export function assertIsoDate(value: string, field: string): void {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new ApplicationError("Validation", `${field} must be a valid ISO-8601 datetime.`);
  }
}
