import type { Metadata } from "next";
import { listErrorCards } from "@/lib/error-cards";
import { ErrorIndexContent } from "@/components/pages/ErrorIndexContent";


export const metadata: Metadata = {
  title: "Error cards — AgentStars",
  description:
    "One page per SaaS / MCP error string: symptom, when the fix applies, first check, fix, sources, investigation trail, status. Mirrors wiki/errors/ in the agent-stars repository.",
  alternates: {
    canonical: "https://agent-stars.com/wiki/errors",
    languages: { en: "https://agent-stars.com/wiki/errors", ja: "https://agent-stars.com/ja/wiki/errors" },
  },
};

export default function ErrorIndex() {
  return <ErrorIndexContent cards={listErrorCards()} lang="en" />;
}
