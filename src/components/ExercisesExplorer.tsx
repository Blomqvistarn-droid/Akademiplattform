"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Exercise } from "@/domains/academy/entities/Exercise";

interface ExercisesExplorerProps {
  exercises: readonly Exercise[];
}

export function ExercisesExplorer({ exercises }: ExercisesExplorerProps) {
  const [query, setQuery] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("alla");

  const activityTypes = useMemo(
    () => [
      "alla",
      ...Array.from(
        new Set(exercises.map((exercise) => exercise.activityType.toLowerCase())),
      ),
    ],
    [exercises],
  );

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) => {
        const matchesQuery = `${exercise.title} ${exercise.purpose} ${exercise.activityType} ${exercise.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesType =
          activityTypeFilter === "alla" ||
          exercise.activityType.toLowerCase() === activityTypeFilter;

        return matchesQuery && matchesType;
      }),
    [activityTypeFilter, exercises, query],
  );

  return (
    <>
      <label htmlFor="exercise-search" className="srOnly">
        Sok ovning
      </label>
      <input
        id="exercise-search"
        className="search"
        placeholder="Sok pa ovning, syfte, tagg eller aktivitet"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <label htmlFor="exercise-activity-type" className="srOnly">
        Filtrera pa aktivitetstyp
      </label>
      <select
        id="exercise-activity-type"
        value={activityTypeFilter}
        onChange={(event) => setActivityTypeFilter(event.target.value)}
      >
        {activityTypes.map((activityType) => (
          <option key={activityType} value={activityType}>
            {activityType === "alla" ? "Alla aktivitetstyper" : activityType}
          </option>
        ))}
      </select>
      <p className="eyebrow" aria-live="polite">
        {filtered.length} ovningar visas
      </p>

      {exercises.length === 0 ? (
        <section className="stateCard stateEmpty" aria-live="polite">
          <h2>Inga ovningar tillgangliga</h2>
          <p>Ovningsbanken ar tom i den valda datakallan.</p>
        </section>
      ) : null}

      {exercises.length > 0 && filtered.length === 0 ? (
        <section className="stateCard stateEmpty" aria-live="polite">
          <h2>Ingen traff</h2>
          <p>Prova ett annat sokord for att hitta ovningar.</p>
        </section>
      ) : null}

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
