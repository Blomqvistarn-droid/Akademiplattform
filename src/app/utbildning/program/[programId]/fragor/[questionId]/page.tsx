import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionStructure } from "@/application/services/academyReadService";
import { EducationBreadcrumbs } from "@/components/EducationBreadcrumbs";
import { Header } from "@/components/Header";

export default async function QuestionDetailPage({
  params,
}: {
  params: { programId: string; questionId: string };
}) {
  const result = await getQuestionStructure(params.programId, params.questionId);

  if (!result) {
    return notFound();
  }

  const { program, questionStructure } = result;

  return (
    <>
      <EducationBreadcrumbs
        items={[
          { label: "Utbildning", href: "/utbildning" },
          { label: program.title, href: `/utbildning/program/${program.id}` },
          { label: questionStructure.question.title },
        ]}
      />
      <Header eyebrow={program.title} title={questionStructure.question.title} />
      <p className="lead">Valj tema for att fortsatta till utbildningsblock och pass.</p>

      <div className="stack">
        {questionStructure.themes.map(({ theme, blocks }) => (
          <Link
            className="card linkCard"
            href={`/utbildning/program/${program.id}/fragor/${questionStructure.question.id}/teman/${theme.id}`}
            key={theme.id}
          >
            <p className="eyebrow">Tema</p>
            <h2>{theme.title}</h2>
            <p>{theme.description}</p>
            <div className="meta">
              <span>{blocks.length} block</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
