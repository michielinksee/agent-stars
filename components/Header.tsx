import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">★</span>
          <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
            AgentStars
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            by KanseiLink
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/about"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
          >
            About
          </Link>
          <a
            href="https://kansei-link.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
          >
            KanseiLink ↗
          </a>
          <a
            href="https://x.com/AgentStarsSG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-80 transition"
          >
            Follow on X
          </a>
        </nav>
      </div>
    </header>
  );
}
