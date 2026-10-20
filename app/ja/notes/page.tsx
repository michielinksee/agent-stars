import { NotesContent } from "@/components/pages/NotesContent";
export const metadata = { title: "接続・解決の記録 | AgentStars" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const p = await searchParams;
  return <NotesContent ja serviceId={typeof p.service_id === "string" ? p.service_id : ""} q={typeof p.q === "string" ? p.q : ""} />;
}
