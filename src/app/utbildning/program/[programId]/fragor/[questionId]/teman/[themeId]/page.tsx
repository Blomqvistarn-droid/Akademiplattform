import Link from "next/link";
import { notFound } from "next/navigation";
import { getThemeStructure } from "@/application/services/academyReadService";
import { EducationBreadcrumbs } from "@/components/EducationBreadcrumbs";
import { Header } from "@/components/Header";

export default async function ThemeDetailPage({
  params,
}: {
  params: { programId: string; questionId: string; themeId: string };
}) {
  const result = await getThemeStructure(
    params.programId,
    params.questionId,
    params.themeId,
  );

  if (!result) {
    return notFound();
  }

  const { program, question, themeStructure } = result;

  return (
    <>
      <EducationBreadcrumbs
        items={[
          { label: "Utbildning", href: "/utbildning" },
          { label: program.title, href: `/utbildning/program/${program.id}` },
          {
            label: question.title,
            href: `/utbildning/program/${program.id}/fragor/${question.id}`,
          },
          { label: themeStructure.theme.title },
        ]}
      />
      <Header eyebrow={program.title} title={themeStructure.theme.title} />
      <p className="lead">Huvudfraga: {question.title}</p>

      <div className="stack">
        {themeStructure.blocks.map((block) => (
          <Link
            className="card linkCard"
            href={`/utbildning/block/${block.id}`}
            key={block.id}
          >
            <p className="eyebrow">Block niva {block.level}</p>
            <h2>{block.title}</h2>
            <p>{block.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
