import Link from "next/link";
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
  let coachData;

  try {
    coachData = await getCoachExperienceData();
  } catch {
    return (
      <>
        <Header eyebrow="Coach Experience" title="Tränarläge" />
        <section className="stateCard stateError">
          <h2>Kunde inte ladda tränarläget</h2>
          <p>Försök igen om en stund.</p>
        </section>
      </>
    );
  }

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
        <Link className="primaryButton" href={`/pass/${nextSession.sessionDetail.session.id}`}>
          Öppna passet
        </Link>
      </section>

      <section className="section">
        <div className="sectionTitle">
          <h2>Plan och block</h2>
          <Link href="/utbildning">Visa planen</Link>
        </div>
        <article className="card">
          <p className="eyebrow">Aktiv utbildningsplan</p>
          <h3>{coachData.teamId ? `Lag ${coachData.teamId}` : "Lag saknas"}</h3>
          <div className="meta">
            <span>{activeBlock?.themeTitle ?? "Inget aktivt block"}</span>
            <span>{activeBlock?.title ?? "Block saknas"}</span>
          </div>
          <div
            className={`progress${activeBlock ? "" : " progressNeutral"}`}
            style={{ marginTop: 14 }}
            aria-label={activeBlock ? "Aktivt block finns" : "Progressdata saknas"}
          >
            <span style={{ width: activeBlock ? "40%" : "100%" }} />
          </div>
          <p>
            {activeBlock?.description ??
              "Neutral progress visas tills exakt progressdata finns tillganglig."}
          </p>
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
