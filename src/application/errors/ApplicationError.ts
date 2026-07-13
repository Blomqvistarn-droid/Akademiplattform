export type ApplicationErrorCategory =
  | "Validation"
  | "NotFound"
  | "Conflict"
  | "Forbidden"
  | "DomainRuleViolation"
  | "InfrastructureFailure";

export class ApplicationError extends Error {
  constructor(
    public readonly category: ApplicationErrorCategory,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export function getApplicationErrorStatus(error: ApplicationError): number {
  switch (error.category) {
    case "Validation":
      return 400;
    case "NotFound":
      return 404;
    case "Conflict":
      return 409;
    case "Forbidden":
      return 403;
    case "DomainRuleViolation":
      return 422;
    case "InfrastructureFailure":
      return 500;
    default:
      return 500;
  }
}
