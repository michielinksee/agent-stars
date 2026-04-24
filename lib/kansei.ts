/**
 * KanseiLink API client for AgentStars.
 *
 * AgentStars is a presentation layer — it does not own data. All data
 * comes from the KanseiLink production API on Railway. Fetches happen in
 * Server Components (App Router default), so there is no CORS concern:
 * the request is Vercel-edge → Railway, not browser → Railway.
 *
 * We revalidate at a 5-minute interval so the leaderboard stays fresh
 * without hammering the backend on every request.
 */

export const KANSEI_API_BASE =
  process.env.NEXT_PUBLIC_KANSEI_API_BASE ??
  "https://kansei-link-mcp-production.up.railway.app";

const REVALIDATE_SECONDS = 300;

// ───────────── Types ─────────────

export interface Service {
  id: string;
  name: string;
  category: string | null;
  axr_grade: string | null;
  axr_score: number | null;
  mcp_status: string | null;
  mcp_endpoint: string | null;
  success_rate: number;
  avg_latency_ms: number;
}

export interface Voice {
  service_id: string;
  service_name: string;
  axr_grade: string | null;
  agent_type: string;
  question_id: string;
  response_choice: string | null;
  response_text: string | null;
  confidence: string | null;
  created_at: string;
}

export interface Freshness {
  services_total: number;
  recipes_total: number;
  services_added_7d: number;
  services_added_30d: number;
  api_changes_7d: number;
  last_crawl_at: string | null;
  last_crawl_discovered: number | null;
  generated_at: string;
}

export interface Changelog {
  id: number;
  service_id: string;
  change_date: string;
  change_type: string;
  summary: string;
  details: string | null;
}

// ───────────── Fetchers ─────────────

async function kanseiFetch<T>(path: string): Promise<T> {
  const url = `${KANSEI_API_BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { "User-Agent": "agent-stars/0.1 (kansei-client)" },
  });
  if (!res.ok) {
    throw new Error(`KanseiLink API ${res.status}: ${path}`);
  }
  return (await res.json()) as T;
}

export async function fetchRankings(limit = 500): Promise<{ services: Service[]; total: number }> {
  return kanseiFetch(`/api/dashboard/rankings?limit=${limit}`);
}

export async function fetchVoices(): Promise<{ voices: Voice[] }> {
  return kanseiFetch(`/api/dashboard/voices`);
}

export async function fetchFreshness(): Promise<Freshness> {
  return kanseiFetch(`/api/dashboard/freshness`);
}

export async function fetchChangelog(limit = 20): Promise<{ entries: Changelog[] }> {
  return kanseiFetch(`/api/dashboard/changelog?limit=${limit}`);
}

// ───────────── Score → Star conversion ─────────────

/**
 * AgentStars maps KanseiLink's 0-100 AXR score to a classic 5-star rating.
 * The buckets are intentionally lenient on the low end (D≈★) because a low
 * score usually means "not enough agent evidence yet" — not that the tool
 * is broken.
 */
export function scoreToStars(score: number | null): number {
  if (score == null || score <= 0) return 0;
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

/** Fractional version for precision (used when we display "★ 4.2") */
export function scoreToStarsPrecise(score: number | null): number {
  if (score == null || score <= 0) return 0;
  return Math.round((score / 20) * 10) / 10;
}

export function gradeColor(grade: string | null): string {
  switch (grade) {
    case "AAA":
      return "text-emerald-500";
    case "AA":
      return "text-emerald-400";
    case "A":
      return "text-cyan-500";
    case "BBB":
      return "text-amber-500";
    case "BB":
      return "text-orange-500";
    case "B":
      return "text-red-500";
    case "C":
    case "D":
    case "F":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}
