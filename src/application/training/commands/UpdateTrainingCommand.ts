export interface UpdateTrainingCommand {
  id: string;
  teamId?: string;
  sessionTemplateId?: string;
  scheduledAt?: string;
  status?: "planned" | "completed" | "cancelled";
}
