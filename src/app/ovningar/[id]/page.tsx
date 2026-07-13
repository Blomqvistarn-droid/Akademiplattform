import { notFound } from "next/navigation";
import { getExerciseById } from "@/application/services/academyReadService";
import { Header } from "@/components/Header";

export default async function ExerciseDetail({ params }: { params: { id: string } }) {
  const exercise = await getExerciseById(params.id);
  if (!exercise) return notFound();
  return <><Header eyebrow={exercise.activityType} title={exercise.title} /><section className="heroCard"><p>{exercise.purpose}</p><div className="meta"><span>{exercise.duration} min</span><span>{exercise.players}</span><span>{exercise.area}</span></div></section>
    {[ ["Organisation", exercise.setup], ["Regler", exercise.rules], ["Coachningspunkter", exercise.coachingPoints], ["Progressioner", exercise.progressions], ["Förenklingar", exercise.simplifications] ].map(([title, items]) => <section className="section" key={title as string}><h2>{title as string}</h2><div className="card"><ul>{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul></div></section>)}
  </>;
}
