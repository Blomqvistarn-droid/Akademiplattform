import Link from "next/link";
import { getSessionTemplates } from "@/application/services/academyReadService";
import { Header } from "@/components/Header";

export default async function SessionsPage() {
  try {
    const sessions = await getSessionTemplates();

    return (
      <>
        <Header title="Träningspass" />
        {sessions.length === 0 ? (
          <section className="stateCard stateEmpty">
            <h2>Inga pass hittades</h2>
            <p>Det finns inga pass i den valda datakallan.</p>
          </section>
        ) : (
          <div className="stack">
            {sessions.map((session) => (
              <Link className="card linkCard" href={`/pass/${session.id}`} key={session.id}>
                <span className="pill">{session.stage}</span>
                <h2>{session.title}</h2>
                <p>{session.keyMessage}</p>
                <div className="meta">
                  <span>{session.duration} min</span>
                  <span>{session.players}</span>
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
        <Header title="Träningspass" />
        <section className="stateCard stateError">
          <h2>Kunde inte ladda pass</h2>
          <p>Forsok igen om en stund.</p>
        </section>
      </>
    );
  }
}
