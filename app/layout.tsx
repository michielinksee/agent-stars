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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
