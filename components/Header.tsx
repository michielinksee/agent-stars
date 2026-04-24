import Link from "next/link";
import { Lang, t } from "@/lib/dict";

export function Header({ lang }: { lang: Lang }) {
  const otherLang: Lang = lang === "en" ? "ja" : "en";
  const otherLangLabel = lang === "en" ? "日本語" : "English";
  const otherLangHref = otherLang === "en" ? "/" : "/ja";
  const homeHref = lang === "en" ? "/" : "/ja";
  const aboutHref = lang === "en" ? "/about" : "/ja/about";

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href={homeHref} className="flex items-center gap-2 group">
          <span className="text-2xl">★</span>
          <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
            AgentStars
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            by KanseiLink
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href={homeHref}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition hidden sm:inline"
          >
            {t(lang, "nav", "leaderboard")}
          </Link>
          <Link
            href={aboutHref}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition hidden sm:inline"
          >
            {t(lang, "nav", "about")}
          </Link>
          <a
            href="https://kansei-link.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition hidden md:inline"
          >
            {t(lang, "nav", "kanseiLink")}
          </a>
          <Link
            href={otherLangHref}
            className="text-xs px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            aria-label={`Switch to ${otherLangLabel}`}
          >
            {otherLangLabel}
          </Link>
          <a
            href="https://x.com/AgentStarsSG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-80 transition"
          >
            {t(lang, "nav", "followOnX")}
          </a>
        </nav>
      </div>
    </header>
  );
}
