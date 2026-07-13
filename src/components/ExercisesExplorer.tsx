"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Exercise } from "@/domains/academy/entities/Exercise";

interface ExercisesExplorerProps {
  exercises: readonly Exercise[];
}

export function ExercisesExplorer({ exercises }: ExercisesExplorerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) =>
        `${exercise.title} ${exercise.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [exercises, query],
  );

  return (
    <>
      <input
        className="search"
        placeholder="Sok pa ovning, numerar eller princip"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="stack">
        {filtered.map((exercise) => (
          <Link
            className="card linkCard"
            href={`/ovningar/${exercise.id}`}
            key={exercise.id}
          >
            <span className="pill">{exercise.activityType}</span>
            <h2>{exercise.title}</h2>
            <p>{exercise.purpose}</p>
            <div className="meta">
              <span>{exercise.duration} min</span>
              <span>{exercise.players}</span>
              <span>{exercise.area}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
