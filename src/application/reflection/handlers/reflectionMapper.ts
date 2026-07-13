import type { ReflectionDto } from "../dto/ReflectionDto";
import type { SessionReflection } from "../../../domains/training/entities/SessionReflection";

export function mapSessionReflectionToDto(reflection: SessionReflection): ReflectionDto {
  return {
    id: String(reflection.id),
    scheduledSessionId: String(reflection.scheduledSessionId),
    authorId: String(reflection.authorId),
    understandingScore: reflection.understandingScore,
    independenceScore: reflection.independenceScore,
    notes: reflection.notes,
    createdAt: reflection.createdAt,
  };
}
