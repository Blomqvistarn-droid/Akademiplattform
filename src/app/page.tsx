import { Header } from "@/components/Header";
import { CoachSessionStepper } from "@/components/CoachSessionStepper";
import { getCoachExperienceData } from "@/application/services/coachExperienceService";

function renderRecommendationMessage(message: string | null | undefined) {
  if (!message) {
    return "Ingen recommendation finns ännu. Genomför ett pass och spara reflektionen.";
  }

  return message;
}

export default async function HomePage() {
  const coachData = await getCoachExperienceData();

  if (!coachData.nextSession) {
    return (
      <>
        <Header eyebrow="Coach Experience" title="Tränarläge" />
        <section className="heroCard">
          <p>Inget planerat pass hittades för den här organisationen.</p>
        </section>
      </>
    );
  }

  const { nextSession, activePlan, activeBlock, latestRecommendation } = coachData;

  return (
    <>
      <Header eyebrow="Coach Experience" title="Tränarläge" />
      <section className="heroCard">
        <span className="pill">{nextSession.sessionDetail.session.stage}</span>
        <h2>{nextSession.sessionDetail.session.title}</h2>
        <p>{nextSession.sessionDetail.session.keyMessage}</p>
        <div className="meta">
          <span>{nextSession.sessionDetail.session.duration} min</span>
          <span>{nextSession.sessionDetail.session.players} spelare</span>
          {activePlan ? <span>Aktiv plan</span> : <span>Ingen aktiv plan</span>}
        </div>
        <a className="primaryButton" href={`/pass/${nextSession.sessionDetail.session.id}`}>
          Öppna passet
        </a>
      </section>

      <section className="section">
        <div className="sectionTitle">
          <h2>Plan och block</h2>
          <a href="/utbildning">Visa planen</a>
        </div>
        <article className="card">
          <p className="eyebrow">Aktiv utbildningsplan</p>
          <h3>{coachData.teamId ? `Lag ${coachData.teamId}` : "Lag saknas"}</h3>
          <div className="meta">
            <span>{activeBlock?.themeTitle ?? "Inget aktivt block"}</span>
            <span>{activeBlock?.title ?? "Block saknas"}</span>
          </div>
          <div className="progress" style={{ marginTop: 14 }}>
            <span style={{ width: activeBlock ? "40%" : "0%" }} />
          </div>
          <p>{activeBlock?.description ?? "Planen saknar ännu ett aktivt block i seedad data."}</p>
        </article>
      </section>

      <CoachSessionStepper
        organizationId={coachData.organizationId}
        scheduledSessionId={nextSession.scheduledSessionId}
        scheduledSessionStatus={nextSession.status}
        educationPlanId={activePlan ? String(activePlan.id) : null}
        educationPlanBlockId={activeBlock?.planBlockId ?? null}
        session={nextSession.sessionDetail.session}
        exercises={nextSession.sessionDetail.exercises}
      />

      <section className="section">
        <h2>Rekommendation efter senaste genomförda pass</h2>
        <div className="card">
          {latestRecommendation ? (
            <>
              <p className="eyebrow">{latestRecommendation.type}</p>
              <h3>{latestRecommendation.message}</h3>
              <p>{latestRecommendation.pedagogicalRationale}</p>
              <div className="meta">
                <span>{latestRecommendation.isFallback ? "Fallback" : "Baserad på reflektion"}</span>
                <span>{latestRecommendation.evidence.reflectionCount} reflektioner</span>
              </div>
            </>
          ) : (
            <p>{renderRecommendationMessage(null)}</p>
          )}
        </div>
      </section>
    </>
  );
}
