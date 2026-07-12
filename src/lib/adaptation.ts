import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";

export function adaptSession(session: SessionTemplate, targetMinutes: number) {
  const mandatory = session.parts.filter((part) => !part.optional);
  const optional = session.parts.filter((part) => part.optional);
  const mandatoryTotal = mandatory.reduce((sum, part) => sum + part.duration, 0);
  const usableParts = targetMinutes < mandatoryTotal ? mandatory : [...mandatory, ...optional];
  const originalTotal = usableParts.reduce((sum, part) => sum + part.duration, 0);
  const factor = targetMinutes / originalTotal;
  return usableParts.map((part) => ({
    ...part,
    duration: Math.max(8, Math.round(part.duration * factor))
  }));
}
