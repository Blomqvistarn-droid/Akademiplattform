import type { RecommendationDto } from "../reflection/dto/ReflectionDto";
import { getRecommendationHandler } from "../reflection/handlers/getRecommendationHandler";
import { createTrainingUnitOfWork } from "../unitOfWork/createTrainingUnitOfWork";
import { createRuntimeDependencies } from "../../composition/createRuntimeDependencies";
import type { EducationPlan } from "../../domains/educationPlan/entities/EducationPlan";
import type { EducationBlock } from "../../domains/academy/entities/EducationBlock";
import type { Theme } from "../../domains/academy/entities/Theme";
import type { SessionDetailData } from "./academyReadService";
import { getSessionDetailData } from "./academyReadService";

export interface CoachSessionSnapshot {
  scheduledSessionId: string;
  teamId: string;
  status: string;
  sessionDetail: SessionDetailData;
}

export interface CoachBlockSummary {
  planBlockId: string;
  id: string;
  title: string;
  themeTitle: string;
  level: EducationBlock["level"];
  description: string;
}

export interface CoachExperienceData {
  organizationId: string;
  teamId: string | null;
  activePlan: EducationPlan | null;
  activeBlock: CoachBlockSummary | null;
  nextSession: CoachSessionSnapshot | null;
  latestRecommendation: RecommendationDto | null;
}

function pickNextPlannedSession<T extends { scheduledAt: string; status: string }>(
  sessions: readonly T[],
): T | null {
  return (
    [...sessions]
      .filter((session) => session.status === "planned")
      .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))[0] ??
    [...sessions].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))[0] ??
    null
  );
}

function pickLatestCompletedSession<T extends { scheduledAt: string; status: string }>(
  sessions: readonly T[],
): T | null {
  return (
    [...sessions]
      .filter((session) => session.status === "completed")
      .sort((left, right) => right.scheduledAt.localeCompare(left.scheduledAt))[0] ??
    null
  );
}

export async function getCoachExperienceData(): Promise<CoachExperienceData> {
  const dependencies = createRuntimeDependencies({
    ...process.env,
    REPOSITORY_PROVIDER: process.env.REPOSITORY_PROVIDER ?? "local",
    ORGANIZATION_ID: process.env.ORGANIZATION_ID ?? "00000000-0000-0000-0000-000000000001",
  });
  const sessions = await dependencies.trainingRepository.getScheduledSessions();

  const nextScheduledSession = pickNextPlannedSession(sessions);
  const latestCompletedSession = pickLatestCompletedSession(sessions);

  const teamId = nextScheduledSession?.teamId ?? latestCompletedSession?.teamId ?? null;
  const activePlan = teamId
    ? await dependencies.educationPlanRepository.getActiveEducationPlanByTeam(teamId)
    : null;

  let activeBlock: CoachBlockSummary | null = null;
  if (activePlan?.activeBlockId) {
    const block = activePlan.blocks.find((item) => item.id === activePlan.activeBlockId);

    if (block) {
      const blockDefinition = await dependencies.educationContentRepository.getBlock(
        block.educationBlockId,
      );
      const theme = blockDefinition
        ? await dependencies.educationContentRepository.getTheme(blockDefinition.themeId)
        : null;

      if (blockDefinition && theme) {
        activeBlock = {
          planBlockId: String(block.id),
          id: String(block.id),
          title: blockDefinition.title,
          themeTitle: theme.title,
          level: blockDefinition.level,
          description: blockDefinition.description,
        };
      }
    }
  }

  const nextSession = nextScheduledSession
    ? {
        scheduledSessionId: nextScheduledSession.id,
        teamId: nextScheduledSession.teamId,
        status: nextScheduledSession.status,
        sessionDetail: (await getSessionDetailData(
          String(nextScheduledSession.sessionTemplateId),
        ))!,
      }
    : null;

  const recommendation = latestCompletedSession
    ? await getRecommendationHandler(
        createTrainingUnitOfWork({
          transactionRunner: dependencies.transactionRunner,
          trainingRepository: dependencies.trainingRepository,
        }),
        { scheduledSessionId: latestCompletedSession.id },
      )
    : null;

  return {
    organizationId: dependencies.organizationContext.organizationId,
    teamId,
    activePlan,
    activeBlock,
    nextSession,
    latestRecommendation: recommendation,
  };
}