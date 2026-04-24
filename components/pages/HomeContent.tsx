import Link from "next/link";
import { fetchRankings, fetchVoices, fetchFreshness, scoreToStarsPrecise } from "@/lib/kansei";
import { Lang, t, tQuestion } from "@/lib/dict";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { StarRating } from "@/components/StarRating";

export async function HomeContent({ lang }: { lang: Lang }) {
  // Parallel fetch — all three endpoints hit KanseiLink at once
  const [rankings, voices, freshness] = await Promise.all([
    fetchRankings(500).catch(() => ({ services: [], total: 0 })),
    fetchVoices().catch(() => ({ voices: [] })),
    fetchFreshness().catch(() => null),
  ]);

  const allServices = rankings.services;
  const top20 = allServices.slice(0, 20);

  // Hidden Gem approximation: ranked 11-40 and axr_score >= 65
  const hiddenGem = allServices
    .slice(10, 40)
    .find((s) => s.axr_score != null && s.axr_score >= 65);

  const recentVoices = voices.voices.slice(0, 6);
  const prefix = lang === "en" ? "" : "/ja";

  const heroTitle = t(lang, "home", "heroTitle");
  const heroHighlight = t(lang, "home", "heroHighlight");
  const heroTitleParts = heroTitle.split(heroHighlight);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center sm:text-left">
            <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
              <p className="inline-block text-xs font-medium tracking-wide text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-full px-3 py-1">
                {t(lang, "home", "dayZeroBadge")}
              </p>
              <p className="inline-block text-xs font-medium tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-3 py-1">
                🔄 {t(lang, "home", "updatedDaily")}
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
              {heroTitleParts[0]}
              <span className="text-amber-500">{heroHighlight}</span>
              {heroTitleParts[1]?.replace(/^\s/, " ")}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {t(lang, "home", "heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
              <a
                href="#leaderboard"
                className="px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium hover:opacity-90 transition"
              >
                {t(lang, "home", "ctaSeeLeaderboard")}
              </a>
              <Link
                href={`${prefix}/about`}
                className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                {t(lang, "home", "ctaHowItWorks")}
              </Link>
            </div>

            {freshness && (
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-500 dark:text-zinc-400 justify-center sm:justify-start">
                <span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {freshness.services_total}
                  </span>{" "}
                  {t(lang, "home", "statsServicesTracked")}
                </span>
                <span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {freshness.recipes_total}
                  </span>{" "}
                  {t(lang, "home", "statsRecipes")}
                </span>
                <span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {freshness.services_added_7d}
                  </span>{" "}
                  {t(lang, "home", "statsAddedThisWeek")}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Hidden Gem */}
        {hiddenGem && (
          <section className="max-w-6xl mx-auto px-5 pb-10">
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2 tracking-wide uppercase">
                  {t(lang, "home", "hiddenGem")}
                </p>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  {hiddenGem.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t(lang, "home", "hiddenGemSubtitle")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StarRating value={scoreToStarsPrecise(hiddenGem.axr_score)} size="md" />
                <Link
                  href={`${prefix}/service/${hiddenGem.id}`}
                  className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                >
                  {t(lang, "home", "hiddenGemCta")}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Leaderboard */}
        <section id="leaderboard" className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {t(lang, "home", "leaderboardTitle")}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                {t(lang, "home", "leaderboardSubtitle")}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {top20.map((service, i) => (
              <ServiceCard key={service.id} service={service} rank={i + 1} lang={lang} />
            ))}
          </div>
        </section>

        {/* Recent Agent Voices */}
        {recentVoices.length > 0 && (
          <section className="max-w-6xl mx-auto px-5 pb-20">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {t(lang, "home", "voicesTitle")}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">
              {t(lang, "home", "voicesSubtitle")}
            </p>
            {lang === "ja" && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6 italic">
                {t(lang, "home", "voicesLangNote")}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {recentVoices.map((v, i) => (
                <div
                  key={`${v.service_id}-${i}`}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`${prefix}/service/${v.service_id}`}
                      className="font-semibold text-zinc-900 dark:text-zinc-50 hover:text-amber-600 dark:hover:text-amber-400"
                    >
                      {v.service_name}
                    </Link>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {v.agent_type}
                    </span>
                  </div>
                  {v.response_text && (
                    <p
                      lang="en"
                      className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4"
                    >
                      &ldquo;{v.response_text}&rdquo;
                    </p>
                  )}
                  <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                    {tQuestion(lang, v.question_id)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
