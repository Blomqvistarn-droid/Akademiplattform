import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import { getProgramStructures } from "@/domains/academy/queries/getProgramStructures";
import { toExerciseId, toSessionTemplateId } from "@/domains/academy/types/ids";
import { createRuntimeDependencies } from "@/composition/createRuntimeDependencies";

export interface SessionDetailData {
  session: SessionTemplate;
  exercises: Exercise[];
}

function getEducationContentRepository() {
  const dependencies = createRuntimeDependencies({
    ...process.env,
    REPOSITORY_PROVIDER: process.env.REPOSITORY_PROVIDER ?? "local",
    ORGANIZATION_ID: process.env.ORGANIZATION_ID ?? "org-default",
  });
  return dependencies.educationContentRepository;
}

export async function getHomeSession() {
  const repository = getEducationContentRepository();
  return repository.getSessionTemplate(toSessionTemplateId("session-winger-1"));
}

export async function getEducationProgramStructures() {
  const repository = getEducationContentRepository();
  return getProgramStructures(repository);
}

export async function getSessionTemplates() {
  const repository = getEducationContentRepository();
  return repository.getSessionTemplates();
}

export async function getExerciseById(exerciseId: string) {
  const repository = getEducationContentRepository();
  return repository.getExercise(toExerciseId(exerciseId));
}

export async function getExercises() {
  const repository = getEducationContentRepository();
  return repository.getExercises();
}

export async function getSessionDetailData(
  sessionId: string,
): Promise<SessionDetailData | null> {
  const repository = getEducationContentRepository();
  const session = await repository.getSessionTemplate(toSessionTemplateId(sessionId));

  if (!session) {
    return null;
  }

  const exerciseEntries = await Promise.all(
    session.parts.map(async (part) => {
      const exercise = await repository.getExercise(part.exerciseId);
      return exercise ? [String(part.exerciseId), exercise] as const : null;
    }),
  );

  const exerciseMap = new Map(
    exerciseEntries.filter(
      (entry): entry is readonly [string, Exercise] => entry !== null,
    ),
  );

  return {
    session,
    exercises: session.parts
      .map((part) => exerciseMap.get(String(part.exerciseId)))
      .filter((exercise): exercise is Exercise => Boolean(exercise)),
  };
}
