import { getExercises } from "@/application/services/academyReadService";
import { ExercisesExplorer } from "@/components/ExercisesExplorer";
import { Header } from "@/components/Header";

export default async function ExercisesPage() {
  try {
    const exercises = await getExercises();

    return (
      <>
        <Header title="Ovningsbank" />
        <ExercisesExplorer exercises={exercises} />
      </>
    );
  } catch {
    return (
      <>
        <Header title="Ovningsbank" />
        <section className="stateCard stateError">
          <h2>Kunde inte ladda ovningar</h2>
          <p>Forsok igen om en stund.</p>
        </section>
      </>
    );
  }
}
