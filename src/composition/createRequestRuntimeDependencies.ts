import {
  createRuntimeDependencies,
  type RuntimeDependencies,
} from "./createRuntimeDependencies";

export function createRequestRuntimeDependencies(
  organizationId: string,
  env: NodeJS.ProcessEnv = process.env,
): RuntimeDependencies {
  return createRuntimeDependencies({
    ...env,
    REPOSITORY_PROVIDER: env.REPOSITORY_PROVIDER ?? "local",
    ORGANIZATION_ID: organizationId,
  });
}
