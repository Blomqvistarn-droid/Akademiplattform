import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header title="Sidan hittades inte" />
      <section className="stateCard stateEmpty">
        <h2>Det gick inte att hitta innehallet</h2>
        <p>Kontrollera adressen eller ga tillbaka till startsidan.</p>
        <Link className="primaryButton" href="/">
          Till startsidan
        </Link>
      </section>
    </>
  );
}
