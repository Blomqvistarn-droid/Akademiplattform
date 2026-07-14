"use client";

import { Header } from "@/components/Header";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <>
      <Header title="Nagot gick fel" />
      <section className="stateCard stateError" role="alert">
        <h2>Kunde inte visa sidan</h2>
        <p>Forsok igen for att ladda om innehallet.</p>
        <button type="button" className="primaryButton" onClick={reset}>
          Forsok igen
        </button>
      </section>
    </>
  );
}
