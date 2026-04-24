import Link from "next/link";
import { Lang, t } from "@/lib/dict";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function AboutContent({ lang }: { lang: Lang }) {
  const prefix = lang === "en" ? "" : "/ja";

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            {t(lang, "about", "title")}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
            {t(lang, "about", "tagline")}
          </p>

          <Section title={t(lang, "about", "whyTitle")}>
            <p>{t(lang, "about", "whyBody1")}</p>
            <p className="mt-4">
              <strong>{t(lang, "about", "whyBody2")}</strong>
            </p>
          </Section>

          <Section title={t(lang, "about", "howTitle")}>
            <p>{t(lang, "about", "howIntro")}</p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>{t(lang, "about", "howBullet1")}</li>
              <li>{t(lang, "about", "howBullet2")}</li>
              <li>{t(lang, "about", "howBullet3")}</li>
              <li>{t(lang, "about", "howBullet4")}</li>
            </ul>
            <p className="mt-4">{t(lang, "about", "howClose")}</p>
          </Section>

          <Section title={t(lang, "about", "philTitle")}>
            <p>{t(lang, "about", "philBody1")}</p>
            <p className="mt-4">{t(lang, "about", "philBody2")}</p>
          </Section>

          <Section title={t(lang, "about", "comingSoonTitle")}>
            <div className="inline-block px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-xs font-medium text-amber-700 dark:text-amber-400 mb-3">
              Phase 3
            </div>
            <p>{t(lang, "about", "comingSoonBody")}</p>
          </Section>

          <Section title={t(lang, "about", "aboutKanseiTitle")}>
            <p>
              {lang === "ja" ? (
                <>
                  AgentStarsは、MCP intelligence プラットフォーム{" "}
                  <a
                    href="https://kansei-link.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    KanseiLink
                  </a>
                  のデータを、消費者向けに可視化するビューです。KanseiLinkが計測とスコアリングを担い、AgentStarsが発見体験を担当します。両プロダクトは{" "}
                  <a
                    href="https://synapsearrows.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Synapse Arrows
                  </a>
                  （🇸🇬 シンガポール）が運営しています。
                </>
              ) : (
                <>
                  AgentStars is the consumer-facing view of data collected and rated by{" "}
                  <a
                    href="https://kansei-link.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    KanseiLink
                  </a>
                  , our MCP intelligence platform for the agent economy. KanseiLink
                  handles the measurement; AgentStars handles the discovery. Both are
                  built by{" "}
                  <a
                    href="https://synapsearrows.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Synapse Arrows
                  </a>{" "}
                  in 🇸🇬 Singapore.
                </>
              )}
            </p>
          </Section>

          <Section title={t(lang, "about", "forVendorsTitle")}>
            <p>
              {t(lang, "about", "forVendorsBody")}{" "}
              <a
                href="mailto:contact@synapse-arrows.com"
                className="text-amber-600 dark:text-amber-400 hover:underline"
              >
                contact@synapse-arrows.com
              </a>
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href={prefix || "/"}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium hover:opacity-90 transition"
            >
              {t(lang, "about", "backToLeaderboard")}
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
        {title}
      </h2>
      <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
