import { Header } from "@/components/Header";
import { blocks, questions } from "@/data/content";

export default function EducationPage() {
  return <><Header eyebrow="Cirka 30 månader" title="Utbildningsplan" />
    <p className="lead">Utbildningen återkommer i en spiral: förstå, lösa under press och känna igen i match.</p>
    <div className="stack">{questions.map((question) => <section className="card" key={question.id}><p className="eyebrow">{question.id}</p><h2>{question.title}</h2><p>{question.description}</p>{blocks.filter((block) => block.questionId === question.id).map((block) => <div className="blockRow" key={block.id}><span>Nivå {block.level}</span><strong>{block.title}</strong></div>)}</section>)}</div>
  </>;
}
