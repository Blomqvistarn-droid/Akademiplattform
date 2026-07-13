import { getExercises } from "@/application/services/academyReadService";
import { ExercisesExplorer } from "@/components/ExercisesExplorer";
import { Header } from "@/components/Header";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <>
      <Header title="Ovningsbank" />
      <ExercisesExplorer exercises={exercises} />
    </>
  );
}
