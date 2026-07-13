import { notFound } from "next/navigation";
import { getSessionDetailData } from "@/application/services/academyReadService";
import { SessionDetailClient } from "@/components/SessionDetailClient";

export default async function SessionDetail({ params }: { params: { id: string } }) {
  const sessionDetail = await getSessionDetailData(params.id);

  if (!sessionDetail) {
    return notFound();
  }

  return <SessionDetailClient session={sessionDetail.session} exercises={sessionDetail.exercises} />;
}
