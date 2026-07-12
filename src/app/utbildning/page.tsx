import { Header } from "@/components/Header";
import { localEducationContentRepository } from "@/infrastructure/repositories/local/localEducationContentRepository";

export default function EducationPage() {
  const blocks = localEducationContentRepository.getBlocks();
  const questions = localEducationContentRepository.getQuestions();
  const themes = localEducationContentRepository.getThemes();
  return <><Header eyebrow="Cirka 30 månader" title="Utbildningsplan" />
    <p className="lead">Utbildningen återkommer i en spiral: förstå, lösa under press och känna igen i match.</p>
    <div className="stack">{questions.map((question) => <section className="card" key={question.id}><p className="eyebrow">{question.id}</p><h2>{question.title}</h2><p>{question.description}</p>{blocks.filter((block) => themes.some((theme) => theme.learningQuestionId === question.id && theme.id === block.themeId)).map((block) => <div className="blockRow" key={block.id}><span>Nivå {block.level}</span><strong>{block.title}</strong></div>)}</section>)}</div>
  </>;
}
