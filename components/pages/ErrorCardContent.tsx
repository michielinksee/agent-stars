import Link from "next/link";
import type { Lang } from "@/lib/dict";
import type { ErrorCard } from "@/lib/error-cards";
import { GITHUB_ERRORS_BASE } from "@/lib/error-cards";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarkdownLite } from "@/components/MarkdownLite";

export const SITE = "https://agent-stars.com";

export function errorCardPath(lang: Lang, key: string): string {
  return `${lang === "ja" ? "/ja" : ""}/wiki/errors/${encodeURIComponent(key)}`;
}

export function errorCardJsonLd(card: ErrorCard, lang: Lang) {
  const url = `${SITE}${errorCardPath(lang, card.error_key)}`;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: card.error_text,
    name: card.error_text,
    about: { "@type": "SoftwareApplication", name: card.service_id, identifier: card.service_id },
    url,
    mainEntityOfPage: url,
    inLanguage: lang,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    author: { "@type": "Organization", name: "Synapse Arrows Pte. Ltd.", url: "https://synapsearrows.com" },
    publisher: { "@type": "Organization", name: "AgentStars", url: SITE },
    isBasedOn: `${GITHUB_ERRORS_BASE}/${card.error_key}.md`,
    keywords: [card.error_key, card.service_id, card.transport, card.symptom_class, ...card.environments].join(", "),
  };
  if (card.last_verified) {
    ld.datePublished = card.last_verified;
    ld.dateModified = card.last_verified;
  }
  return ld;
}

const L = {
  en: {
    back: "← All error cards",
    service: "service",
    environments: "environments",
    transport: "transport",
    status: "status",
    sources: "sources",
    lastVerified: "last_verified",
    notVerified: "not independently verified",
    canonical: "Canonical record (正本): the Markdown file in the agent-stars repository on GitHub — ",
    canonicalTail: ". Edits and retests land there first; this page mirrors it. License CC BY 4.0.",
    note: "One record, not a rate or a ranking. Status levels: lived / verified are evidence; unverified / extracted_from_issue are leads and never affect grades.",
  },
  ja: {
    back: "← エラーカード一覧",
    service: "サービス",
    environments: "環境",
    transport: "通信方式",
    status: "状態",
    sources: "出所",
    lastVerified: "確認日",
    notVerified: "未確認（確認日なし）",
    canonical: "正本: GitHub の agent-stars リポジトリにある Markdown — ",
    canonicalTail: "。編集と追試はまずそちらに入り、このページはその写しです。ライセンス CC BY 4.0。",
    note: "一人の観測の記録であり、率や順位ではありません。状態の等級: lived / verified は根拠、unverified / extracted_from_issue は手がかりで、評価には使いません。",
  },
};

export function ErrorCardContent({ card, lang }: { card: ErrorCard; lang: Lang }) {
  const s = L[lang];
  const ghUrl = `${GITHUB_ERRORS_BASE}/${card.error_key}.md`;
  const linkBase = `${lang === "ja" ? "/ja" : ""}/wiki/errors`;
  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-5 py-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(errorCardJsonLd(card, lang)) }}
          />
          <Link href={linkBase} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 inline-block">
            {s.back}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 break-words mb-4">
            {card.error_text}
          </h1>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <dt>error_key</dt><dd><code className="break-all">{card.error_key}</code></dd>
            <dt>{s.service}</dt><dd>{card.service_id}</dd>
            <dt>{s.environments}</dt><dd>{card.environments.join(", ")}</dd>
            <dt>{s.transport}</dt><dd>{card.transport} · {card.organ_stopped} · {card.symptom_class}</dd>
            <dt>{s.status}</dt><dd><code>{card.status}</code></dd>
            <dt>{s.sources}</dt><dd>{card.source_count}</dd>
            <dt>{s.lastVerified}</dt><dd>{card.last_verified || s.notVerified}</dd>
          </dl>
          <MarkdownLite source={card.body} linkBase={linkBase} skipH1 />
          <hr className="my-10 border-zinc-200 dark:border-zinc-800" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {s.canonical}
            <a href={ghUrl} className="underline break-all">{ghUrl}</a>
            {s.canonicalTail}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">{s.note}</p>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  );
}
