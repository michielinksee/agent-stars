import { KANSEI_API_BASE } from "./kansei";

export interface FieldNote {
  id: string; service_id: string; runtime: string; task: string; symptom: string;
  procedure: string; conditions: string; evidence: string;
  observation_kind: "execution" | "documentation" | "hypothesis";
  status: "unverified"; created_at: string;
}
export interface NoteResult {
  id: string; runtime: string; outcome: "succeeded" | "failed" | "not_applicable";
  conditions: string; evidence: string; same_session: number; created_at: string;
}
export interface NoteDetail {
  note: FieldNote; results: NoteResult[];
  counts: { total: number; succeeded: number; failed: number; not_applicable: number };
}
export class NotesUnavailable extends Error {
  constructor(public status: number) { super("Field notes unavailable"); }
}
async function read<T>(path: string): Promise<T> {
  const response = await fetch(`${KANSEI_API_BASE}/api/v1/${path}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new NotesUnavailable(response.status);
  return response.json();
}
export function fetchNotes(serviceId: string, q = "") {
  return read<{ notes: FieldNote[] }>(`notes?${new URLSearchParams({ service_id: serviceId, q })}`);
}
export function fetchNote(id: string) { return read<NoteDetail>(`notes/${encodeURIComponent(id)}`); }
