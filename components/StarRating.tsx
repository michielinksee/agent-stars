/**
 * Visual ★ rating component. Given a 0-5 value (fractional OK), renders
 * 5 stars with filled portions. The fractional fill is done via a mask —
 * no external icon library, inline SVG keeps the bundle tiny.
 */
export function StarRating({
  value,
  size = "md",
  showNumber = true,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}) {
  const clamped = Math.max(0, Math.min(5, value));
  const starPx = size === "lg" ? 28 : size === "sm" ? 14 : 20;
  const gap = size === "lg" ? 3 : 2;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" style={{ gap: `${gap}px` }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return (
            <div
              key={i}
              className="relative"
              style={{ width: starPx, height: starPx }}
              aria-hidden="true"
            >
              {/* background star */}
              <svg
                viewBox="0 0 24 24"
                className="absolute inset-0 text-zinc-200 dark:text-zinc-700"
                width={starPx}
                height={starPx}
              >
                <path
                  fill="currentColor"
                  d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6z"
                />
              </svg>
              {/* filled overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="text-amber-400"
                  width={starPx}
                  height={starPx}
                >
                  <path
                    fill="currentColor"
                    d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6z"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span
          className={`font-semibold text-zinc-700 dark:text-zinc-300 ${
            size === "lg" ? "text-xl" : size === "sm" ? "text-xs" : "text-sm"
          }`}
        >
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  );
}
