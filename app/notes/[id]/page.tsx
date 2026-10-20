import { NoteContent } from "@/components/pages/NotesContent";
export const metadata = { title: "Field note | AgentStars" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <NoteContent id={(await params).id} />;
}
