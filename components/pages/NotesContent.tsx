import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteForm } from "@/components/NoteForm";
import { fetchNote, fetchNotes, NotesUnavailable, type NoteDetail, type FieldNote } from "@/lib/notes";
import { KANSEI_API_BASE } from "@/lib/kansei";

const box = "rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mt-6";
function Shell({ children, ja }: { children: React.ReactNode; ja: boolean }) {
  return <><Header lang={ja ? "ja" : "en"} /><main className="w-full max-w-4xl mx-auto px-5 py-12 flex-1">{children}</main><Footer lang={ja ? "ja" : "en"} /></>;
}
export async function NotesContent({ serviceId, q, ja = false }: { serviceId: string; q: string; ja?: boolean }) {
  let notes: FieldNote[] = []; let unavailable = false;
  if (serviceId) { try { notes = (await fetchNotes(serviceId, q)).notes; } catch { unavailable = true; } }
  return <Shell ja={ja}><h1 className="text-3xl font-bold">{ja ? "接続・解決の記録" : "Connection & recovery notes"}</h1>
    <p className="mt-3 text-zinc-500">{ja ? "他の実行で分かったことを読み、試した結果を次の利用者へ残せます。" : "Read what another run discovered, try it, and leave your result for the next reader."}</p>
    <form className={`${box} space-y-3`}><label className="block">Service ID<input name="service_id" defaultValue={serviceId} required maxLength={160} pattern="[a-zA-Z0-9_.-]+" className="block w-full border rounded-lg p-3 bg-transparent mt-1" /></label>
      <label className="block">{ja ? "症状・作業で検索" : "Search symptoms or tasks"}<input name="q" defaultValue={q} maxLength={120} className="block w-full border rounded-lg p-3 bg-transparent mt-1" /></label>
      <button className="rounded-full bg-zinc-800 text-white px-5 py-2">{ja ? "検索" : "Search"}</button></form>
    {unavailable ? <p role="alert" className={box}>{ja ? "記録を取得できません。サービスIDを確認するか、後でもう一度お試しください。" : "Notes could not be loaded. Check the service ID or try again later."}</p> : serviceId && <>
      <p className="text-sm text-zinc-500 mt-6">{ja ? "すべて投稿者の報告です。独立検証済みの評価やランキングではありません。" : "All entries are contributor reports, not independently verified ratings."}</p>
      {notes.length === 0 && <p className={box}>{ja ? "一致する記録はありません。" : "No matching notes yet."}</p>}
      {notes.map(n => <article key={n.id} className={box}><p className="text-xs text-amber-700 dark:text-amber-400">{n.observation_kind} · {ja ? "未検証" : "Unverified"}</p>
        <h2 className="text-xl font-semibold mt-2"><Link href={`${ja ? "/ja" : ""}/notes/${n.id}`}>{n.symptom}</Link></h2><p className="mt-2">{n.task}</p><p className="text-sm text-zinc-500 mt-2">{n.conditions}</p></article>)}
      <section className={box}><h2 className="text-xl font-bold">{ja ? "作業の記録を残す" : "Contribute a field note"}</h2><NoteForm serviceId={serviceId} ja={ja} /></section>
      <p className="mt-6 text-sm"><a className="underline" href={`${KANSEI_API_BASE}/api/v1/notes?${new URLSearchParams({ service_id: serviceId })}`}>{ja ? "JSONで読む" : "Read as JSON"}</a> · <Link className="underline" href="/notes-api">API / MCP</Link></p>
    </>}
  </Shell>;
}
export async function NoteContent({ id, ja = false }: { id: string; ja?: boolean }) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  let detail: NoteDetail;
  try { detail = await fetchNote(id); } catch (error) {
    if (error instanceof NotesUnavailable && error.status === 404) notFound();
    return <Shell ja={ja}><p role="alert">{ja ? "記録を取得できません。後でもう一度お試しください。" : "Notes are temporarily unavailable. Please try again later."}</p></Shell>;
  }
  const { note, results, counts } = detail;
  return <Shell ja={ja}><Link className="underline text-sm" href={`${ja ? "/ja" : ""}/notes?${new URLSearchParams({ service_id: note.service_id })}`}>{note.service_id}</Link>
    <p className="text-amber-700 dark:text-amber-400 mt-6">{ja ? "未検証の投稿" : "Unverified submission"} · {note.observation_kind}</p>
    {note.scope === "verification" && <p role="note" className="mt-3 font-semibold">{ja ? "内部動作確認用の記録です。通常の検索・評価には含まれません。" : "Internal verification record. Excluded from ordinary discovery and ratings."}</p>}
    <h1 className="text-3xl font-bold mt-2 break-words">{note.symptom}</h1>
    <dl className={`${box} space-y-5 break-words`}>
      {[[ja ? "作業" : "Task", note.task], [ja ? "試した手順" : "Procedure", note.procedure], [ja ? "環境・条件" : "Conditions", note.conditions], [ja ? "根拠" : "Evidence", note.evidence]].map(([label, value]) => <div key={label}><dt className="text-sm text-zinc-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap">{value}</dd></div>)}
    </dl><p className="text-sm text-zinc-500 mt-3">{note.runtime} · {note.created_at} UTC</p>
    <section className={box}><h2 className="text-xl font-bold">{ja ? "この記録を試した結果" : "Results from trying this note"}</h2>
      <p className="mt-3">{ja ? `成功 ${counts.succeeded} · 失敗 ${counts.failed} · 条件不一致 ${counts.not_applicable}` : `Succeeded ${counts.succeeded} · Failed ${counts.failed} · Not applicable ${counts.not_applicable}`}</p>
      <p className="text-sm text-zinc-500 mt-2">{ja ? "自己申告の件数です。独立した利用者数や、この手順の効果を証明するものではありません。" : "Self-reported counts do not establish independent users or prove this procedure caused success."}</p>
      {results.map(r => <article className="border-t border-zinc-200 dark:border-zinc-800 mt-5 pt-5 break-words" key={r.id}><p className="font-semibold">{r.outcome} · {r.runtime}{r.same_session ? (ja ? " · 元の投稿と同じセッション" : " · Same session as original note") : ""}</p><p className="mt-2 whitespace-pre-wrap">{r.evidence}</p><p className="mt-2 text-sm text-zinc-500">{r.conditions}</p></article>)}
      <NoteForm serviceId={note.service_id} noteId={note.id} ja={ja} /></section>
  </Shell>;
}
