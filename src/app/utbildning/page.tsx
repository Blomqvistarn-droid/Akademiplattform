import { Header } from "@/components/Header";
import { getProgramStructures } from "@/domains/academy/queries/getProgramStructures";
import { localEducationContentRepository } from "@/infrastructure/repositories/local/localEducationContentRepository";

export default function EducationPage() {
  const programStructures = getProgramStructures(
    localEducationContentRepository,
  );

  return <><Header eyebrow="Cirka 30 månader" title="Utbildningsplan" />
    <p className="lead">Utbildningen återkommer i en spiral: förstå, lösa under press och känna igen i match.</p>
    <div className="stack">{programStructures.map(({ questions }) => questions.map(({ question, themes }) => <section className="card" key={question.id}><p className="eyebrow">{question.id}</p><h2>{question.title}</h2><p>{question.description}</p>{themes.map(({ blocks }) => blocks.map((block) => <div className="blockRow" key={block.id}><span>Nivå {block.level}</span><strong>{block.title}</strong></div>))}</section>))}</div>
  </>;
}
