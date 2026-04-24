import Link from "next/link";
import { Service, scoreToStarsPrecise, gradeColor } from "@/lib/kansei";
import { Lang } from "@/lib/dict";
import { StarRating } from "./StarRating";

export function ServiceCard({
  service,
  rank,
  lang,
}: {
  service: Service;
  rank?: number;
  lang: Lang;
}) {
  const stars = scoreToStarsPrecise(service.axr_score);
  const successPct =
    service.success_rate != null ? Math.round(service.success_rate * 100) : null;
  const prefix = lang === "en" ? "" : "/ja";
  const href = `${prefix}/service/${service.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            {rank != null && (
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                #{rank}
              </span>
            )}
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
              {service.name}
            </h3>
          </div>
          {service.category && (
            <span className="inline-block text-xs text-zinc-500 dark:text-zinc-400">
              {service.category}
            </span>
          )}
        </div>
        {service.axr_grade && (
          <span className={`text-xs font-bold ${gradeColor(service.axr_grade)}`}>
            {service.axr_grade}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <StarRating value={stars} size="sm" />
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          {successPct != null && successPct > 0 && (
            <span>✓ {successPct}%</span>
          )}
          {service.mcp_status === "official" && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              {lang === "ja" ? "公式" : "Official"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
