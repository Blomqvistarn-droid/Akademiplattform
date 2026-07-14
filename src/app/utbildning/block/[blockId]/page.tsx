import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEducationProgramStructures,
  getBlockById,
  getSessionsByBlockId,
} from "@/application/services/academyReadService";
import { EducationBreadcrumbs } from "@/components/EducationBreadcrumbs";
import { Header } from "@/components/Header";

export default async function BlockDetailPage({
  params,
}: {
  params: { blockId: string };
}) {
  const [block, sessions, structures] = await Promise.all([
    getBlockById(params.blockId),
    getSessionsByBlockId(params.blockId),
    getEducationProgramStructures(),
  ]);

  if (!block) {
    return notFound();
  }

  const breadcrumbContext = structures
    .flatMap(({ program, questions }) =>
      questions.flatMap(({ question, themes }) =>
        themes
          .filter(({ theme }) => String(theme.id) === String(block.themeId))
          .map(({ theme }) => ({ program, question, theme })),
      ),
    )
    .at(0);

  return (
    <>
      <EducationBreadcrumbs
        items={[
          { label: "Utbildning", href: "/utbildning" },
          ...(breadcrumbContext
            ? [
                {
                  label: breadcrumbContext.program.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}`,
                },
                {
                  label: breadcrumbContext.question.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}/fragor/${breadcrumbContext.question.id}`,
                },
                {
                  label: breadcrumbContext.theme.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}/fragor/${breadcrumbContext.question.id}/teman/${breadcrumbContext.theme.id}`,
                },
              ]
            : []),
          { label: block.title },
        ]}
      />
      <Header eyebrow={`Niva ${block.level}`} title={block.title} />
      <section className="heroCard">
        <p>{block.description}</p>
        <h2>Onskat beteende</h2>
        <ul>
          {block.desiredBehaviours.map((behaviour) => (
            <li key={behaviour}>{behaviour}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Pass kopplade till blocket</h2>
        {sessions.length === 0 ? (
          <section className="stateCard stateEmpty">
            <h3>Inga pass hittades</h3>
            <p>Det finns inga pass kopplade till detta block i datakallan.</p>
          </section>
        ) : (
          <div className="stack">
            {sessions.map((session) => (
              <Link
                className="card linkCard"
                href={`/pass/${session.id}`}
                key={session.id}
              >
                <span className="pill">{session.stage}</span>
                <h3>{session.title}</h3>
                <p>{session.keyMessage}</p>
                <div className="meta">
                  <span>{session.duration} min</span>
                  <span>{session.players}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
