import { NotesContent } from "@/components/pages/NotesContent";
export const metadata = { title: "Connection & recovery notes | AgentStars" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const p = await searchParams;
  return <NotesContent serviceId={typeof p.service_id === "string" ? p.service_id : ""} q={typeof p.q === "string" ? p.q : ""} />;
}
