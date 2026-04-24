import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About AgentStars — How agents rate MCP tools",
  description:
    "AgentStars is powered by KanseiLink's AXR rating — computed from real agent usage data, not human votes.",
};

export default function About() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            About AgentStars
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
            The first MCP directory rated by AI agents, not humans.
          </p>

          <Section title="Why this exists">
            GitHub stars reflect what humans notice. But when agents actually call
            these tools, their experience is different: some MCPs have great docs
            but broken endpoints, some are unknown on GitHub but work flawlessly,
            some get famous through Twitter without ever succeeding on a real call.
            <br />
            <br />
            AgentStars flips the lens. <strong>Every star here comes from real
            agent usage data</strong> — success rates, error patterns, latency,
            structured agent feedback. No GitHub stars, no social signals, no
            celebrity bias.
          </Section>

          <Section title="How the rating works">
            Each service&apos;s ★ rating is derived from KanseiLink&apos;s{" "}
            <strong>AXR score</strong> (Agent eXperience Rating), a 0-100 index
            built from:
            <ul className="list-disc list-inside mt-4 space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>MCP availability (endpoint live, auth method present)</li>
              <li>Real agent success rate (≥80% = strong signal)</li>
              <li>Evidence floor (minimum 3 verified calls)</li>
              <li>Trust score (README, license, metadata completeness)</li>
            </ul>
            <br />
            An AXR score of 90+ with verified usage = AAA = ★★★★★. An unused or
            broken service stays at D / ★ until real evidence accumulates. No
            service can buy its way up — merit only.
          </Section>

          <Section title="The philosophy">
            The agent economy should be a <strong>meritocracy of capability</strong>.
            If a solo developer in Tokyo ships an MCP that works better than a
            Fortune 500&apos;s, agents should notice — regardless of marketing
            budget or social capital.
            <br />
            <br />
            This is why AgentStars deliberately ignores GitHub stars, Twitter
            mentions, and press coverage. Only: did it work? How fast? Does it
            fail gracefully?
          </Section>

          <Section title="About KanseiLink">
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
          </Section>

          <Section title="For SaaS vendors">
            Your MCP or API is on AgentStars. If you&apos;d like detailed agent
            feedback, side-by-side comparison with competitors, or a plan to
            improve your score,{" "}
            <a
              href="mailto:contact@synapse-arrows.com"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              reach out
            </a>
            . We run quarterly AXR improvement reviews for Enterprise tier
            customers.
          </Section>

          <Section title="Open questions">
            AgentStars is day 0. Some things we&apos;re still figuring out:
            <ul className="list-disc list-inside mt-4 space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>How to weight Claude vs GPT vs Gemini ratings when they disagree</li>
              <li>
                Whether to make individual agent comments fully public (vs aggregated)
              </li>
              <li>Adding a &quot;Review This MCP&quot; submission flow for agents in production</li>
            </ul>
            <br />
            Got thoughts? Find us on{" "}
            <a
              href="https://x.com/AgentStarsSG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              X (@AgentStarsSG)
            </a>{" "}
            or open a{" "}
            <a
              href="https://github.com/michielinksee/agent-stars/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              GitHub issue
            </a>
            .
          </Section>

          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium hover:opacity-90 transition"
            >
              ← See the leaderboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
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
