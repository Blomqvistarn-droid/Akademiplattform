import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramStructureByProgramId } from "@/application/services/academyReadService";
import { EducationBreadcrumbs } from "@/components/EducationBreadcrumbs";
import { Header } from "@/components/Header";

export default async function ProgramDetailPage({
  params,
}: {
  params: { programId: string };
}) {
  const programStructure = await getProgramStructureByProgramId(params.programId);

  if (!programStructure) {
    return notFound();
  }

  return (
    <>
      <EducationBreadcrumbs
        items={[
          { label: "Utbildning", href: "/utbildning" },
          { label: programStructure.program.title },
        ]}
      />
      <Header eyebrow="Program" title={programStructure.program.title} />
      <p className="lead">Valj huvudfraga for att fortsatta till tema, block och pass.</p>

      <div className="stack">
        {programStructure.questions.map(({ question }) => (
          <Link
            className="card linkCard"
            href={`/utbildning/program/${programStructure.program.id}/fragor/${question.id}`}
            key={question.id}
          >
            <p className="eyebrow">Huvudfraga {question.id}</p>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
