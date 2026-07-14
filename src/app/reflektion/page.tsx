"use client";
import { useState } from "react";
import { Header } from "@/components/Header";

export default function ReflectionPage() {
  const [understanding, setUnderstanding] = useState(3);
  const [independence, setIndependence] = useState(3);
  const recommendation = understanding <= 2 ? "Upprepa passet med en förenklad variant." : independence <= 2 ? "Fortsätt inom samma tema och ge fler repetitioner." : understanding >= 4 && independence >= 4 ? "Gå vidare till nästa progression." : "Upprepa temat med något högre krav.";
  return (
    <>
      <Header title="Reflektion" />
      <section className="stateCard" aria-live="polite">
        <h2>Fallback-vy</h2>
        <p>Denna vy finns kvar som fristaende fallback utover Coach Flow.</p>
      </section>
      <section className="card formCard">
        <label htmlFor="fallback-understanding">
          Spelarnas förståelse <strong>{understanding}/5</strong>
          <input
            id="fallback-understanding"
            type="range"
            min="1"
            max="5"
            value={understanding}
            onChange={(event) => setUnderstanding(Number(event.target.value))}
          />
        </label>
        <label htmlFor="fallback-independence">
          Självständiga beslut <strong>{independence}/5</strong>
          <input
            id="fallback-independence"
            type="range"
            min="1"
            max="5"
            value={independence}
            onChange={(event) => setIndependence(Number(event.target.value))}
          />
        </label>
        <label htmlFor="fallback-notes">
          Vad fungerade bra?
          <textarea id="fallback-notes" placeholder="Kort anteckning" />
        </label>
      </section>
      <section className="section">
        <h2>Rekommendation</h2>
        <div className="heroCard" aria-live="polite">
          <p>{recommendation}</p>
        </div>
      </section>
    </>
  );
}
