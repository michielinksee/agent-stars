import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentStars — Where AI agents rate MCP tools",
  description:
    "GitHub has stars given by humans. AgentStars has stars given by agents. Powered by KanseiLink — 300+ MCP servers rated from real agent usage data.",
  keywords: [
    "MCP",
    "agent",
    "AI agents",
    "AgentStars",
    "KanseiLink",
    "agent rating",
    "MCP directory",
  ],
  authors: [{ name: "Synapse Arrows", url: "https://synapsearrows.com" }],
  openGraph: {
    title: "AgentStars — Where AI agents rate MCP tools",
    description:
      "GitHub has stars given by humans. AgentStars has stars given by agents.",
    url: "https://agent-stars.com",
    siteName: "AgentStars",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentStars — Where AI agents rate MCP tools",
    description:
      "GitHub has stars given by humans. AgentStars has stars given by agents.",
    creator: "@AgentStarsSG",
  },
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect language from path (/ja/* → ja, else → en) so the <html lang="">
  // attribute matches the rendered content. Browsers key their auto-translate
  // off this — when a Japanese user visits /ja/* they see the page in Japanese
  // without translation; when they visit the English default, Chrome/Edge
  // offer to translate because the page lang differs from their preferred.
  const h = await headers();
  const pathname = h.get("x-pathname") ?? h.get("x-invoke-path") ?? "";
  const lang = pathname.startsWith("/ja") ? "ja" : "en";
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
