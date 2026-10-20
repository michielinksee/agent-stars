import { NoteContent } from "@/components/pages/NotesContent";
export const metadata = { title: "接続・解決の記録 | AgentStars" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <NoteContent ja id={(await params).id} />;
}
