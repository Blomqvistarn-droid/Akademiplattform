"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/domains/academy/entities/Exercise";
import type { SessionTemplate } from "@/domains/academy/entities/SessionTemplate";
import { Header } from "@/components/Header";
import { adaptSession } from "@/lib/adaptation";

interface SessionDetailClientProps {
  session: SessionTemplate;
  exercises: Exercise[];
}

export function SessionDetailClient({
  session,
  exercises,
}: SessionDetailClientProps) {
  const [minutes, setMinutes] = useState(session.duration);

  const exerciseMap = useMemo(
    () =>
      new Map(
        exercises.map((exercise) => [String(exercise.id), exercise] as const),
      ),
    [exercises],
  );

  const parts = useMemo(
    () => adaptSession(session, minutes),
    [session, minutes],
  );

  return (
    <>
      <Header eyebrow={session.stage} title={session.title} />
      <section className="heroCard">
        <h2>Dagens budskap</h2>
        <p>{session.keyMessage}</p>
        <div className="controlRow">
          <label>
            Passtid <strong>{minutes} min</strong>
          </label>
          <input
            type="range"
            min="50"
            max="90"
            step="5"
            value={minutes}
            onChange={(event) => setMinutes(Number(event.target.value))}
          />
        </div>
      </section>
      <section className="section">
        <h2>Larandemal</h2>
        <div className="card">
          <ul>{session.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
        </div>
      </section>
      <section className="section">
        <h2>Passupplagg</h2>
        <div className="timeline">
          {parts.map((part, index) => {
            const exercise = exerciseMap.get(String(part.exerciseId));
            if (!exercise) return null;

            return (
              <article className="timelineItem" key={`${part.exerciseId}-${index}`}>
                <div className="step">{index + 1}</div>
                <div className="card">
                  <div className="sectionTitle">
                    <span className="pill">{exercise.activityType}</span>
                    <strong>{part.duration} min</strong>
                  </div>
                  <h3>{exercise.title}</h3>
                  <p>{part.focus}</p>
                  <details>
                    <summary>Organisation och coachning</summary>
                    <h4>Organisation</h4>
                    <ul>{exercise.setup.map((item) => <li key={item}>{item}</li>)}</ul>
                    <h4>Coachningspunkter</h4>
                    <ul>{exercise.coachingPoints.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section">
        <h2>Reflektion efter passet</h2>
        <div className="card">
          <ul>
            {session.reflectionQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
