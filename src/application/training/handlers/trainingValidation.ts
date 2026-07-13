import { ApplicationError } from "../../errors/ApplicationError";

const SCHEDULED_SESSION_STATUSES = new Set(["planned", "completed", "cancelled"]);

export function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApplicationError("Validation", `${field} is required.`);
  }
}

export function assertIsoDate(value: string, field: string): void {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new ApplicationError("Validation", `${field} must be a valid ISO-8601 datetime.`);
  }
}

export function assertScheduledSessionStatus(value: string): void {
  if (!SCHEDULED_SESSION_STATUSES.has(value)) {
    throw new ApplicationError(
      "Validation",
      "status must be one of planned, completed, cancelled.",
    );
  }
}

export function mapRepositoryError(error: unknown): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);

    if (code === "23505") {
      return new ApplicationError("Conflict", "A resource with the same unique key already exists.");
    }

    if (code === "23503") {
      return new ApplicationError("DomainRuleViolation", "A referenced resource does not exist in organization scope.");
    }

    if (code === "23502") {
      return new ApplicationError("Validation", "Required database field is missing.");
    }
  }

  return new ApplicationError("InfrastructureFailure", "Unexpected infrastructure failure.");
}
