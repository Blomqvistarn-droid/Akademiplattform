"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import type { RecommendationDto } from "@/application/reflection/dto/ReflectionDto";

interface CoachSessionStepperProps {
  organizationId: string;
  scheduledSessionId: string;
  scheduledSessionStatus: string;
  educationPlanId: string | null;
  educationPlanBlockId: string | null;
  session: SessionTemplate;
  exercises: readonly Exercise[];
}

type StepperFlowState = "session" | "reflection" | "decision" | "done";

export function CoachSessionStepper({
  organizationId,
  scheduledSessionId,
  scheduledSessionStatus,
  educationPlanId,
  educationPlanBlockId,
  session,
  exercises,
}: CoachSessionStepperProps) {
  const router = useRouter();
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [flowState, setFlowState] = useState<StepperFlowState>(
    scheduledSessionStatus === "completed" ? "reflection" : "session",
  );
  const [understanding, setUnderstanding] = useState(3);
  const [independence, setIndependence] = useState(3);
  const [notes, setNotes] = useState("");
  const [decisionType, setDecisionType] = useState<"accept" | "override">("accept");
  const [rationale, setRationale] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationDto | null>(null);
  const [savedDecisionSummary, setSavedDecisionSummary] = useState<string | null>(null);

  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [String(exercise.id), exercise] as const)),
    [exercises],
  );

  const currentPart = session.parts[currentPartIndex] ?? session.parts[0];
  const currentExercise = currentPart
    ? exerciseMap.get(String(currentPart.exerciseId)) ?? null
    : null;

  const canGoPrevious = currentPartIndex > 0;
  const canGoNext = currentPartIndex < session.parts.length - 1;
  const isReadOnlyCompleted = scheduledSessionStatus === "completed" && flowState === "session";

  async function markSessionCompleted(): Promise<void> {
    const confirmed = window.confirm("Bekrafta att passet ar genomfort innan du fortsatter till reflektion.");

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/trainings/${scheduledSessionId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Kunde inte markera passet som genomfort.");
      }

      setFlowState("reflection");
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Ovantat fel vid passavslut.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveReflection(): Promise<void> {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          scheduledSessionId,
          authorId: "00000000-0000-0000-0000-000000000201",
          understandingScore: understanding,
          independenceScore: independence,
          notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Kunde inte spara reflektion.");
      }

      const payload = (await response.json()) as { recommendation: RecommendationDto };
      setRecommendation(payload.recommendation);
      setFlowState("decision");
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Ovantat fel vid reflektion.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveDecision(): Promise<void> {
    if (!educationPlanId) {
      setError("Aktiv utbildningsplan saknas for laget.");
      return;
    }

    if (!recommendation) {
      setError("Recommendation saknas. Spara reflektion forst.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/education-plans/${educationPlanId}/progress-events`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          scheduledSessionId,
          recommendationType: recommendation.type,
          decisionType,
          rationale,
          educationPlanBlockId,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Kunde inte spara beslut i progressionen.");
      }

      setSavedDecisionSummary(
        decisionType === "accept"
          ? "Recommendation accepterad och sparad som progressionshandelse."
          : "Overstyrning sparad som progressionshandelse.",
      );
      setFlowState("done");
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Ovantat fel vid beslutssparning.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="sectionTitle">
        <h2>Genomför passet steg för steg</h2>
        <span className="pill">{currentPartIndex + 1}/{session.parts.length}</span>
      </div>
      <div className="card">
        <p className="eyebrow">Aktiv passdel</p>
        <h3>{currentExercise?.title ?? session.title}</h3>
        <p>{currentPart?.focus}</p>
        <div className="meta">
          <span>{currentExercise?.activityType ?? session.stage}</span>
          <span>{currentPart?.duration ?? session.duration} min</span>
          {currentPart?.optional ? <span>Valfri del</span> : null}
        </div>

        {currentExercise ? (
          <div className="section" style={{ marginTop: 18 }}>
            <p><strong>Syfte:</strong> {currentExercise.purpose}</p>
            <p><strong>Organisation:</strong> {currentExercise.area}</p>
            <details>
              <summary>Instruktioner och coachning</summary>
              <h4>Setup</h4>
              <ul>{currentExercise.setup.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Regler</h4>
              <ul>{currentExercise.rules.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Coachningspunkter</h4>
              <ul>{currentExercise.coachingPoints.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Progression</h4>
              <ul>{currentExercise.progressions.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Förenklingar</h4>
              <ul>{currentExercise.simplifications.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <button
            type="button"
            onClick={() => setCurrentPartIndex((index) => Math.max(0, index - 1))}
            style={{
              border: "1px solid var(--line)",
              background: "#fff",
              color: "var(--text)",
              padding: "13px 18px",
              borderRadius: 12,
              fontWeight: 800,
              opacity: canGoPrevious ? 1 : 0.5,
            }}
            disabled={!canGoPrevious}
          >
            Föregående
          </button>
          {canGoNext ? (
            <button
              type="button"
              onClick={() => setCurrentPartIndex((index) => Math.min(session.parts.length - 1, index + 1))}
              className="primaryButton"
              style={{ marginTop: 0 }}
            >
              Nästa passdel
            </button>
          ) : (
            <button
              type="button"
              className="primaryButton"
              style={{ marginTop: 0 }}
              onClick={markSessionCompleted}
              disabled={isSubmitting || isReadOnlyCompleted}
            >
              {isReadOnlyCompleted ? "Passet ar redan genomfort" : "Markera genomfort"}
            </button>
          )}
        </div>

        {error ? (
          <p style={{ color: "#7f1d1d", marginTop: 12 }}>
            {error}
          </p>
        ) : null}
      </div>

      <div className="section" style={{ marginTop: 18 }}>
        <h3>Passets struktur</h3>
        <div className="stack">
          {session.parts.map((part, index) => {
            const exercise = exerciseMap.get(String(part.exerciseId));

            return (
              <button
                key={`${part.exerciseId}-${index}`}
                type="button"
                onClick={() => setCurrentPartIndex(index)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid var(--line)",
                  background: index === currentPartIndex ? "var(--accent2)" : "#fff",
                  color: "var(--text)",
                  padding: 14,
                  borderRadius: 16,
                }}
              >
                <strong>{index + 1}. {exercise?.title ?? "Passdel"}</strong>
                <div className="meta" style={{ marginTop: 8 }}>
                  <span>{part.duration} min</span>
                  <span>{part.focus}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section" style={{ marginTop: 18 }}>
        <h3>Efter passet</h3>
        <div className="card">
          <ul>
            {session.reflectionQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      </div>

      {flowState === "reflection" ? (
        <div className="section" style={{ marginTop: 18 }}>
          <h3>Reflektion direkt efter passet</h3>
          <div className="card formCard">
            <label>
              Spelarnas förståelse <strong>{understanding}/5</strong>
              <input
                type="range"
                min="1"
                max="5"
                value={understanding}
                onChange={(event) => setUnderstanding(Number(event.target.value))}
                disabled={isSubmitting}
              />
            </label>
            <label>
              Sjalvstandiga beslut <strong>{independence}/5</strong>
              <input
                type="range"
                min="1"
                max="5"
                value={independence}
                onChange={(event) => setIndependence(Number(event.target.value))}
                disabled={isSubmitting}
              />
            </label>
            <label>
              Notering
              <textarea
                placeholder="Kort anteckning"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <button
              type="button"
              className="primaryButton"
              onClick={saveReflection}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sparar..." : "Spara reflektion"}
            </button>
          </div>
        </div>
      ) : null}

      {flowState === "decision" && recommendation ? (
        <div className="section" style={{ marginTop: 18 }}>
          <h3>Recommendation och beslut</h3>
          <div className="card" style={{ marginBottom: 12 }}>
            <p className="eyebrow">{recommendation.type}</p>
            <h4>{recommendation.message}</h4>
            <p>{recommendation.pedagogicalRationale}</p>
            <div className="meta">
              <span>{recommendation.isFallback ? "Fallback" : "Baserad pa reflektion"}</span>
              <span>{recommendation.evidence.reflectionCount} reflektioner</span>
            </div>
          </div>
          <div className="card formCard">
            <label>
              Tranarens beslut
              <select
                value={decisionType}
                onChange={(event) => setDecisionType(event.target.value as "accept" | "override")}
                disabled={isSubmitting}
              >
                <option value="accept">Acceptera recommendation</option>
                <option value="override">Overstyr recommendation</option>
              </select>
            </label>
            <label>
              Motivering (valfri)
              <textarea
                placeholder="Varfor valde du detta beslut?"
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <button
              type="button"
              className="primaryButton"
              onClick={saveDecision}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sparar..." : "Spara beslut i Education Plan Progress"}
            </button>
          </div>
        </div>
      ) : null}

      {flowState === "done" ? (
        <div className="section" style={{ marginTop: 18 }}>
          <div className="heroCard">
            <h3>Passflodet ar slutfört</h3>
            <p>{savedDecisionSummary}</p>
            <button
              type="button"
              className="primaryButton"
              onClick={() => router.refresh()}
            >
              Tillbaka till uppdaterad dashboard
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}