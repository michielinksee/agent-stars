import { ServiceDetailContent } from "@/components/pages/ServiceDetailContent";
import { fetchRankings } from "@/lib/kansei";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { services } = await fetchRankings(500).catch(() => ({ services: [] }));
  const s = services.find((x) => x.id === id);
  if (!s) return { title: "サービスが見つかりません — AgentStars" };
  return {
    title: `${s.name} — AgentStars`,
    description: `${s.name} のエージェント評価: ${s.axr_grade ?? "未評価"}、実使用データに基づく。`,
  };
}

export default async function ServiceDetailJa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceDetailContent id={id} lang="ja" />;
}
