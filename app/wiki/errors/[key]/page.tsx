import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getErrorCard, listErrorCards } from "@/lib/error-cards";
import { ErrorCardContent } from "@/components/pages/ErrorCardContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return listErrorCards().map((c) => ({ key: c.error_key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const card = getErrorCard(key);
  if (!card) return { title: "Error card not found — AgentStars" };
  const desc = [card.applies_when, card.first_check].filter(Boolean).join(" / ").slice(0, 300);
  return {
    title: card.error_text,
    description: desc,
    alternates: {
      canonical: `https://agent-stars.com/wiki/errors/${encodeURIComponent(key)}`,
      languages: {
        en: `https://agent-stars.com/wiki/errors/${encodeURIComponent(key)}`,
        ja: `https://agent-stars.com/ja/wiki/errors/${encodeURIComponent(key)}`,
      },
    },
    openGraph: { title: card.error_text, description: desc, type: "article", url: `https://agent-stars.com/wiki/errors/${encodeURIComponent(key)}` },
  };
}

export default async function ErrorCardPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const card = getErrorCard(key);
  if (!card) notFound();
  return <ErrorCardContent card={card} lang="en" />;
}
