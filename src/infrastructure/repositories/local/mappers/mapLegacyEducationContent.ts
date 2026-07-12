import type { EducationBlock as AcademyEducationBlock } from "@/domains/academy/entities/EducationBlock";
import type { EducationProgram } from "@/domains/academy/entities/EducationProgram";
import type { Exercise as AcademyExercise } from "@/domains/academy/entities/Exercise";
import type { LearningQuestion } from "@/domains/academy/entities/LearningQuestion";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import type { SessionTemplatePart } from "@/domains/academy/entities/SessionTemplatePart";
import type { Theme } from "@/domains/academy/entities/Theme";
import type { AcademyContent } from "@/domains/academy/validation/validateEducationContent";
import {
  toEducationBlockId,
  toExerciseId,
  toLearningQuestionId,
  toProgramId,
  toSessionTemplateId,
  toThemeId,
} from "../../../../domains/academy/types/ids";
import type { ThemeId } from "@/domains/academy/types/ids";
import type {
  EducationBlock as LegacyEducationBlock,
  Exercise as LegacyExercise,
  GuidingQuestion,
  Session,
  SessionPart,
} from "@/types/education";

const PROGRAM_ID = toProgramId("program-7v7");

export interface LegacyEducationContent {
  readonly questions: readonly GuidingQuestion[];
  readonly blocks: readonly LegacyEducationBlock[];
  readonly sessions: readonly Session[];
  readonly exercises: readonly LegacyExercise[];
}

export type MappedEducationContent = AcademyContent;

function createThemeId(questionId: string): ThemeId {
  return toThemeId(`theme-${questionId}`);
}

function mapEducationProgram(): EducationProgram {
  return {
    id: PROGRAM_ID,
    title: "7 mot 7",
    description: "",
  };
}

function mapLearningQuestion(question: GuidingQuestion): LearningQuestion {
  return {
    id: toLearningQuestionId(question.id),
    programId: PROGRAM_ID,
    title: question.title,
    description: question.description,
  };
}

function mapTheme(question: GuidingQuestion): Theme {
  return {
    id: createThemeId(question.id),
    learningQuestionId: toLearningQuestionId(question.id),
    title: question.title,
    description: question.description,
  };
}

function mapEducationBlock(
  block: LegacyEducationBlock,
): AcademyEducationBlock {
  return {
    id: toEducationBlockId(block.id),
    themeId: createThemeId(block.questionId),
    title: block.title,
    level: block.level,
    description: block.description,
    desiredBehaviours: [...block.desiredBehaviours],
  };
}

function mapSessionTemplatePart(part: SessionPart): SessionTemplatePart {
  return {
    exerciseId: toExerciseId(part.exerciseId),
    duration: part.duration,
    focus: part.focus,
    optional: part.optional,
  };
}

function mapSessionTemplate(session: Session): SessionTemplate {
  return {
    id: toSessionTemplateId(session.id),
    title: session.title,
    blockId: toEducationBlockId(session.blockId),
    stage: session.stage,
    duration: session.duration,
    players: session.players,
    keyMessage: session.keyMessage,
    objectives: [...session.objectives],
    parts: session.parts.map(mapSessionTemplatePart),
    reflectionQuestions: [...session.reflectionQuestions],
  };
}

function mapExercise(exercise: LegacyExercise): AcademyExercise {
  return {
    id: toExerciseId(exercise.id),
    title: exercise.title,
    activityType: exercise.activityType,
    players: exercise.players,
    duration: exercise.duration,
    area: exercise.area,
    purpose: exercise.purpose,
    setup: [...exercise.setup],
    rules: [...exercise.rules],
    coachingPoints: [...exercise.coachingPoints],
    progressions: [...exercise.progressions],
    simplifications: [...exercise.simplifications],
    tags: [...exercise.tags],
  };
}

export function mapLegacyEducationContent(
  content: LegacyEducationContent,
): MappedEducationContent {
  return {
    programs: [mapEducationProgram()],
    learningQuestions: content.questions.map(mapLearningQuestion),
    themes: content.questions.map(mapTheme),
    educationBlocks: content.blocks.map(mapEducationBlock),
    sessionTemplates: content.sessions.map(mapSessionTemplate),
    exercises: content.exercises.map(mapExercise),
  };
}
