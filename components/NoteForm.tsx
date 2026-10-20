"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KANSEI_API_BASE } from "@/lib/kansei";

export function NoteForm({ serviceId, noteId, ja = false }: { serviceId: string; noteId?: string; ja?: boolean }) {
  const router = useRouter();
  const session = useRef<string | null>(null);
  const request = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const field = "block w-full mt-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent p-3";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    session.current ??= crypto.randomUUID(); request.current ??= crypto.randomUUID();
    const body = { ...values, service_id: serviceId, share: values.share === "on", runtime: "other",
      request_id: request.current, session_id: session.current };
    try {
      const response = await fetch(`${KANSEI_API_BASE}/api/v1/notes${noteId ? `/${encodeURIComponent(noteId)}/results` : ""}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000),
      });
      if (response.status === 429) throw new Error("rate_limited");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "unavailable");
      request.current = null;
      setMessage(ja ? "記録しました。" : "Recorded.");
      if (noteId) { form.reset(); setComplete(true); router.refresh(); }
      else router.push(`${ja ? "/ja" : ""}/notes/${data.note.id}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unavailable";
      const errors: Record<string, [string, string]> = {
        rate_limited: ["投稿が続いています。1分ほど待ってから再試行してください。", "Please wait a minute before submitting again."],
        session_already_reported: ["この実行の結果は記録済みです。", "This execution has already been recorded."],
        invalid_note_input: ["入力内容と公開への同意を確認してください。", "Please check the fields and publication consent."],
        service_not_found: ["サービスIDが見つかりません。", "This service ID was not found."],
        request_id_conflict: ["入力内容を確認し、編集してから再送してください。", "Please review and edit the form before resubmitting."],
      };
      setMessage(errors[reason]?.[ja ? 0 : 1] ?? (ja ? "保存を確認できませんでした。同じ内容で再試行できます。" : "Saving could not be confirmed. You can retry the same submission."));
    } finally { setBusy(false); }
  }
  if (complete) return <p role="status" className="mt-6">{message}</p>;
  return <form onSubmit={submit} onChange={() => { request.current = null; }} className="space-y-4 mt-6">
    <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
      {noteId ? <label className="block">{ja ? "試した結果" : "Result after trying this note"}
        <select className={field} name="outcome" required defaultValue=""><option value="" disabled>{ja ? "選んでください" : "Select a result"}</option>
          <option value="succeeded">{ja ? "成功した" : "Succeeded"}</option><option value="failed">{ja ? "失敗した" : "Failed"}</option>
          <option value="not_applicable">{ja ? "条件が合わなかった" : "Not applicable"}</option></select></label> : <>
        <label className="block">{ja ? "試した作業" : "Task"}<input className={field} name="task" maxLength={300} required /></label>
        <label className="block">{ja ? "症状・困ったこと" : "Symptom or difficulty"}<textarea className={field} name="symptom" maxLength={600} required /></label>
        <label className="block">{ja ? "試した手順" : "Procedure tried"}<textarea className={field} name="procedure" maxLength={2000} rows={4} required /></label>
        <label className="block">{ja ? "記録の種類" : "Observation type"}<select className={field} name="observation_kind" defaultValue="execution">
          <option value="execution">{ja ? "実行した記録" : "Execution report"}</option><option value="documentation">{ja ? "資料からの情報" : "Documentation"}</option>
          <option value="hypothesis">{ja ? "未実行の仮説" : "Untested hypothesis"}</option></select></label>
      </>}
      <label className="block">{ja ? "環境・バージョン・前提条件" : "Environment, versions and conditions"}<textarea className={field} name="conditions" maxLength={600} required /></label>
      <label className="block">{ja ? "確認できた結果・根拠（要約）" : "Observed evidence (summary)"}<textarea className={field} name="evidence" maxLength={1000} required /></label>
      <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" name="share" required />
        <span>{ja ? "この要約の公開に同意します。秘密情報・個人情報・生ログを含めていません。" : "I authorize publishing this summary. It contains no secrets, personal information or raw logs."}</span></label>
      <button className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-zinc-950" type="submit">{busy ? (ja ? "保存中…" : "Saving…") : (ja ? "公開して記録" : "Publish summary")}</button>
    </fieldset>
    <p role="status" className="text-sm break-words">{message}</p>
  </form>;
}
