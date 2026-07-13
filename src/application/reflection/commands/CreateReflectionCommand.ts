export interface CreateReflectionCommand {
  scheduledSessionId: string;
  authorId: string;
  understandingScore: number;
  independenceScore: number;
  notes: string;
}
