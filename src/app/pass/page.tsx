import Link from "next/link";
import { Header } from "@/components/Header";
import { localEducationContentRepository } from "@/infrastructure/repositories/local/localEducationContentRepository";

export default function SessionsPage() {
  const sessions = localEducationContentRepository.getSessions();
  return <><Header title="Träningspass" /><div className="stack">{sessions.map((session) => <Link className="card linkCard" href={`/pass/${session.id}`} key={session.id}><span className="pill">{session.stage}</span><h2>{session.title}</h2><p>{session.keyMessage}</p><div className="meta"><span>{session.duration} min</span><span>{session.players}</span></div></Link>)}</div></>;
}
