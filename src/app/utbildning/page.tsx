import Link from "next/link";
import { getEducationProgramStructures } from "@/application/services/academyReadService";
import { Header } from "@/components/Header";

export default async function EducationPage() {
  try {
    const programStructures = await getEducationProgramStructures();

    return (
      <>
        <Header eyebrow="Cirka 30 månader" title="Utbildningsplan" />
        <p className="lead">
          Utbildningen återkommer i en spiral: förstå, lösa under press och känna igen i match.
        </p>

        {programStructures.length === 0 ? (
          <section className="stateCard stateEmpty">
            <h2>Ingen utbildningsplan hittades</h2>
            <p>Utbildningsinnehall saknas i den valda datakallan.</p>
          </section>
        ) : (
          <div className="stack">
            {programStructures.map(({ program, questions }) => (
              <Link
                className="card linkCard"
                href={`/utbildning/program/${program.id}`}
                key={program.id}
              >
                <p className="eyebrow">Program</p>
                <h2>{program.title}</h2>
                <p>{program.description || "Starta din resa via huvudfragorna."}</p>
                <div className="meta">
                  <span>{questions.length} huvudfragor</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </>
    );
  } catch {
    return (
      <>
        <Header eyebrow="Cirka 30 månader" title="Utbildningsplan" />
        <section className="stateCard stateError">
          <h2>Kunde inte ladda utbildningsplan</h2>
          <p>Forsok igen om en stund.</p>
        </section>
      </>
    );
  }
}
