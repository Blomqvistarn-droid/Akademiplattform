"use client";
import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { localEducationContentRepository } from "@/infrastructure/repositories/local/localEducationContentRepository";
import { adaptSession } from "@/lib/adaptation";

const getExercise = localEducationContentRepository.getExercise;

export default function SessionDetail({ params }: { params: { id: string } }) {
  const session = localEducationContentRepository.getSessionTemplate(params.id);
  const [minutes, setMinutes] = useState(session?.duration ?? 75);
  if (!session) return notFound();
  const parts = useMemo(() => adaptSession(session, minutes), [session, minutes]);
  return <><Header eyebrow={session.stage} title={session.title} />
    <section className="heroCard"><h2>Dagens budskap</h2><p>{session.keyMessage}</p><div className="controlRow"><label>Passtid <strong>{minutes} min</strong></label><input type="range" min="50" max="90" step="5" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /></div></section>
    <section className="section"><h2>Lärandemål</h2><div className="card"><ul>{session.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div></section>
    <section className="section"><h2>Passupplägg</h2><div className="timeline">{parts.map((part, index) => { const exercise = getExercise(part.exerciseId)!; return <article className="timelineItem" key={`${part.exerciseId}-${index}`}><div className="step">{index + 1}</div><div className="card"><div className="sectionTitle"><span className="pill">{exercise.activityType}</span><strong>{part.duration} min</strong></div><h3>{exercise.title}</h3><p>{part.focus}</p><details><summary>Organisation och coachning</summary><h4>Organisation</h4><ul>{exercise.setup.map((x) => <li key={x}>{x}</li>)}</ul><h4>Coachningspunkter</h4><ul>{exercise.coachingPoints.map((x) => <li key={x}>{x}</li>)}</ul></details></div></article>;})}</div></section>
    <section className="section"><h2>Reflektion efter passet</h2><div className="card"><ul>{session.reflectionQuestions.map((question) => <li key={question}>{question}</li>)}</ul></div></section>
  </>;
}
