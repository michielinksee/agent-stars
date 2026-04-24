import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchRankings,
  fetchVoices,
  fetchChangelog,
  scoreToStarsPrecise,
  gradeColor,
} from "@/lib/kansei";
import { Lang, t } from "@/lib/dict";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";

export async function ServiceDetailContent({
  id,
  lang,
}: {
  id: string;
  lang: Lang;
}) {
  const [rankings, voicesResp, changelog] = await Promise.all([
    fetchRankings(500).catch(() => ({ services: [], total: 0 })),
    fetchVoices().catch(() => ({ voices: [] })),
    fetchChangelog(100).catch(() => ({ entries: [] })),
  ]);

  const service = rankings.services.find((s) => s.id === id);
  if (!service) notFound();

  const voices = voicesResp.voices.filter((v) => v.service_id === id);
  const serviceChanges = changelog.entries.filter((e) => e.service_id === id).slice(0, 5);

  const stars = scoreToStarsPrecise(service.axr_score);
  const successPct =
    service.success_rate != null ? Math.round(service.success_rate * 100) : null;
  const latencyMs = service.avg_latency_ms ? Math.round(service.avg_latency_ms) : null;
  const prefix = lang === "en" ? "" : "/ja";

  // Derive source links — GitHub repo from mcp_endpoint if applicable
  const githubMatch = service.mcp_endpoint?.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
  const githubRepo = githubMatch ? githubMatch[1] : null;
  const githubUrl = githubRepo ? `https://github.com/${githubRepo}` : null;
  const kanseiLinkUrl = `https://kansei-link.com/services/${service.id}`;
  const hasSources = !!(githubUrl || service.mcp_endpoint);

  const mcpStatusLabel =
    service.mcp_status === "official"
      ? t(lang, "service", "mcpStatusOfficial")
      : service.mcp_status === "third_party"
      ? t(lang, "service", "mcpStatusThirdParty")
      : service.mcp_status === "community"
      ? t(lang, "service", "mcpStatusCommunity")
      : t(lang, "service", "mcpStatusApiOnly");

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 py-12">
          <Link
            href={prefix || "/"}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 inline-block"
          >
            {t(lang, "service", "backToLeaderboard")}
          </Link>

          {/* Hero */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                    {service.name}
                  </h1>
                  {service.axr_grade && (
                    <span className={`text-lg font-bold ${gradeColor(service.axr_grade)}`}>
                      {service.axr_grade}
                    </span>
                  )}
                </div>
                {service.category && (
                  <span className="inline-block text-sm text-zinc-500 dark:text-zinc-400">
                    {service.category}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <StarRating value={stars} size="lg" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  {t(lang, "service", "axrScoreLabel")} {service.axr_score ?? "—"}/100
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat
                label={t(lang, "service", "agentSuccess")}
                value={successPct != null ? `${successPct}%` : "—"}
                hint={t(lang, "service", "agentSuccessHint")}
              />
              <Stat
                label={t(lang, "service", "avgLatency")}
                value={latencyMs ? `${latencyMs}ms` : "—"}
                hint={t(lang, "service", "avgLatencyHint")}
              />
              <Stat
                label={t(lang, "service", "mcpStatus")}
                value={mcpStatusLabel}
                hint={t(lang, "service", "mcpStatusHint")}
              />
              <Stat
                label={t(lang, "service", "agentVoices")}
                value={voices.length.toString()}
                hint={t(lang, "service", "agentVoicesHint")}
              />
            </div>

            {/* Source links */}
            {hasSources && (
              <div className="mt-8">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  {t(lang, "service", "sourceLinks")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      <span className="font-mono text-xs">GitHub</span>
                      <span className="text-xs">↗</span>
                    </a>
                  )}
                  {service.mcp_endpoint && !githubUrl && (
                    <a
                      href={service.mcp_endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      <span>MCP Endpoint</span>
                      <span className="text-xs">↗</span>
                    </a>
                  )}
                  <a
                    href={kanseiLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  >
                    <span>KanseiLink</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Agent Voices */}
          {voices.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {t(lang, "service", "whatAgentsSay")}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
                {t(lang, "service", "whatAgentsSaySubtitle")}
              </p>
              <div className="grid gap-3">
                {voices.map((v, i) => (
                  <div
                    key={`${v.question_id}-${i}`}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
                  >
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
                      {v.question_id.replace(/_/g, " ")}
                    </p>
                    {v.response_text && (
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        &ldquo;{v.response_text}&rdquo;
                      </p>
                    )}
                    <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                      — {v.agent_type}
                      {v.confidence && ` · confidence: ${v.confidence}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Changelog */}
          {serviceChanges.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {t(lang, "service", "recentChanges")}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
                {t(lang, "service", "recentChangesSubtitle")}
              </p>
              <div className="space-y-3">
                {serviceChanges.map((c) => (
                  <div
                    key={c.id}
                    className="flex gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap pt-0.5">
                      {c.change_date}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {c.change_type}
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {c.summary}
                        </span>
                      </div>
                      {c.details && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{c.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {voices.length === 0 && serviceChanges.length === 0 && (
            <div className="mt-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                {t(lang, "service", "emptyState")}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{value}</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{hint}</p>
    </div>
  );
}
