import { Header } from "@/components/Header";

export default function Loading() {
  return (
    <>
      <Header title="Laddar" />
      <section className="stateCard" aria-live="polite">
        <h2>Innehall laddas</h2>
        <p>Vantan pa data...</p>
      </section>
    </>
  );
}
