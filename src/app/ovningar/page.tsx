"use client";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { localEducationContentRepository } from "@/infrastructure/repositories/local/localEducationContentRepository";

export default function ExercisesPage() {
  const [query, setQuery] = useState("");
  const exercises = localEducationContentRepository.getExercises();
  const filtered = exercises.filter((exercise) => `${exercise.title} ${exercise.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <><Header title="Övningsbank" /><input className="search" placeholder="Sök på övning, numerär eller princip" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="stack">{filtered.map((exercise) => <Link className="card linkCard" href={`/ovningar/${exercise.id}`} key={exercise.id}><span className="pill">{exercise.activityType}</span><h2>{exercise.title}</h2><p>{exercise.purpose}</p><div className="meta"><span>{exercise.duration} min</span><span>{exercise.players}</span><span>{exercise.area}</span></div></Link>)}</div></>;
}
