import Link from "next/link";
import { getSessionTemplates } from "@/application/services/academyReadService";
import { Header } from "@/components/Header";

export default async function SessionsPage() {
  const sessions = await getSessionTemplates();
  return <><Header title="Träningspass" /><div className="stack">{sessions.map((session) => <Link className="card linkCard" href={`/pass/${session.id}`} key={session.id}><span className="pill">{session.stage}</span><h2>{session.title}</h2><p>{session.keyMessage}</p><div className="meta"><span>{session.duration} min</span><span>{session.players}</span></div></Link>)}</div></>;
}
