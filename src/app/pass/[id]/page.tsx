import { notFound } from "next/navigation";
import {
  getEducationProgramStructures,
  getSessionDetailData,
} from "@/application/services/academyReadService";
import { EducationBreadcrumbs } from "@/components/EducationBreadcrumbs";
import { SessionDetailClient } from "@/components/SessionDetailClient";

export default async function SessionDetail({ params }: { params: { id: string } }) {
  const [sessionDetail, structures] = await Promise.all([
    getSessionDetailData(params.id),
    getEducationProgramStructures(),
  ]);

  if (!sessionDetail) {
    return notFound();
  }

  const breadcrumbContext = structures
    .flatMap(({ program, questions }) =>
      questions.flatMap(({ question, themes }) =>
        themes
          .filter(({ blocks }) =>
            blocks.some(
              (block) => String(block.id) === String(sessionDetail.session.blockId),
            ),
          )
          .map(({ theme, blocks }) => ({
            program,
            question,
            theme,
            block: blocks.find(
              (block) => String(block.id) === String(sessionDetail.session.blockId),
            ),
          })),
      ),
    )
    .find((entry) => Boolean(entry.block));

  return (
    <>
      <EducationBreadcrumbs
        items={[
          { label: "Utbildning", href: "/utbildning" },
          ...(breadcrumbContext
            ? [
                {
                  label: breadcrumbContext.program.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}`,
                },
                {
                  label: breadcrumbContext.question.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}/fragor/${breadcrumbContext.question.id}`,
                },
                {
                  label: breadcrumbContext.theme.title,
                  href: `/utbildning/program/${breadcrumbContext.program.id}/fragor/${breadcrumbContext.question.id}/teman/${breadcrumbContext.theme.id}`,
                },
                {
                  label: breadcrumbContext.block?.title ?? "Block",
                  href: `/utbildning/block/${sessionDetail.session.blockId}`,
                },
              ]
            : []),
          { label: sessionDetail.session.title },
        ]}
      />
      <SessionDetailClient
        session={sessionDetail.session}
        exercises={sessionDetail.exercises}
      />
    </>
  );
}
