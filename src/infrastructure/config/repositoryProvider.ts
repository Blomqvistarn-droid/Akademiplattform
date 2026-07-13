export type RepositoryProvider = "local" | "database";

export function readRepositoryProviderFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): RepositoryProvider {
  const provider = env.REPOSITORY_PROVIDER;

  if (provider === "local" || provider === "database") {
    return provider;
  }

  throw new Error(
    "Invalid REPOSITORY_PROVIDER. Expected one of: local, database.",
  );
}
