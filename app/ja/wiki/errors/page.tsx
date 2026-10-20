import type { Metadata } from "next";
import { listErrorCards } from "@/lib/error-cards";
import { ErrorIndexContent } from "@/components/pages/ErrorIndexContent";


export const metadata: Metadata = {
  title: "エラーカード — AgentStars",
  description:
    "SaaS / MCP のエラー文ごとに一枚: 症状・該当条件・最初の確認・解決手順・出所・調査の軌跡・状態。agent-stars リポジトリの wiki/errors/ の写し。",
  alternates: {
    canonical: "https://agent-stars.com/ja/wiki/errors",
    languages: { en: "https://agent-stars.com/wiki/errors", ja: "https://agent-stars.com/ja/wiki/errors" },
  },
};

export default function ErrorIndexJa() {
  return <ErrorIndexContent cards={listErrorCards()} lang="ja" />;
}
