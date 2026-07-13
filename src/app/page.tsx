import Link from "next/link";
import { Header } from "@/components/Header";
import { getHomeSession } from "@/application/services/academyReadService";

export default async function HomePage() {
  const session = await getHomeSession();

  if (!session) {
    return null;
  }

  return <>
    <Header eyebrow="7 mot 7 · nivå 1" title="Nästa träning" />
    <section className="heroCard">
      <span className="pill">{session.stage}</span>
      <h2>{session.title}</h2>
      <p>{session.keyMessage}</p>
      <div className="meta"><span>{session.duration} min</span><span>{session.players} spelare</span></div>
      <Link className="primaryButton" href={`/pass/${session.id}`}>Öppna passet</Link>
    </section>
    <section className="section">
      <div className="sectionTitle"><h2>Aktuellt block</h2><Link href="/utbildning">Visa planen</Link></div>
      <article className="card"><p className="eyebrow">Hur skapar vi ett överläge?</p><h3>Hitta yttern genom 2 mot 1</h3><div className="progress"><span style={{width:"25%"}} /></div><p>Pass 1 av 4</p></article>
    </section>
    <section className="section"><h2>Ledarfokus</h2><div className="card"><ul><li>Observera om bollhållaren driver mot försvararen.</li><li>Lyssna efter den fria spelarens kommunikation.</li><li>Fråga vad spelaren såg innan du ger en lösning.</li></ul></div></section>
  </>;
}
