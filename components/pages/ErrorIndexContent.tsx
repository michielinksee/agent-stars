import Link from "next/link";
import type { Lang } from "@/lib/dict";
import type { ErrorCard } from "@/lib/error-cards";
import { groupByService } from "@/lib/error-cards";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const L = {
  en: {
    title: "Error cards",
    intro:
      "One page per error string, written so that a search for the text you just saw lands here. Each card: symptom → when it applies → first check → fix → success check → sources → next split → investigation trail → retests → status. The canonical files are wiki/errors/*.md in the agent-stars repository on GitHub; this site mirrors them.",
    repo: "Repository (正本)",
    env: "environments",
    status: "status",
    sources: "sources",
    note: "Cards never state rates or rankings. lived / verified are evidence; unverified / extracted_from_issue are leads and never affect grades.",
  },
  ja: {
    title: "エラーカード",
    intro:
      "エラー文ごとに一枚。いま見たエラー文で検索したときに着地するように書いてあります。各カード: 症状 → 該当条件 → 最初の確認 → 解決手順 → 成功の確認 → 根拠 → 解決しなかった場合 → 調査の軌跡 → 追試 → 状態。正本は GitHub の agent-stars リポジトリの wiki/errors/*.md で、このサイトはその写しです。",
    repo: "リポジトリ（正本）",
    env: "環境",
    status: "状態",
    sources: "出所",
    note: "率や順位は書きません。lived / verified は根拠、unverified / extracted_from_issue は手がかりで、評価には使いません。",
  },
};

export function ErrorIndexContent({ cards, lang }: { cards: ErrorCard[]; lang: Lang }) {
  const s = L[lang];
  const prefix = lang === "ja" ? "/ja" : "";
  const groups = groupByService(cards);
  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{s.title}</h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-2">{s.intro}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            {s.repo}:{" "}
            <a href="https://github.com/michielinksee/agent-stars/tree/main/wiki/errors" className="underline">
              github.com/michielinksee/agent-stars/wiki/errors
            </a>
          </p>
          {[...groups.entries()].map(([service, list]) => (
            <section key={service} className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                {service}
              </h2>
              <ul className="space-y-3">
                {list.map((c) => (
                  <li key={c.error_key} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <Link href={`${prefix}/wiki/errors/${encodeURIComponent(c.error_key)}`} className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline break-words">
                      {c.error_text}
                    </Link>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span><code>{c.error_key}</code></span>
                      <span>{s.env}: {c.environments.join(", ")}</span>
                      <span>{c.transport}</span>
                      <span>{s.status}: <code>{c.status}</code></span>
                      <span>{s.sources}: {c.source_count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-8">{s.note}</p>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
