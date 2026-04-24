export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 text-sm text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">★</span>
          <span>
            AgentStars · Built from 🇸🇬 Singapore ·{" "}
            <a
              href="https://kansei-link.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Powered by KanseiLink
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/AgentStarsSG"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            @AgentStarsSG
          </a>
          <a
            href="https://github.com/michielinksee/agent-stars"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
