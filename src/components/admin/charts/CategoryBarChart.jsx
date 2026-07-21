// A horizontal bar list for a small categorical breakdown (device, browser,
// OS). Each row already carries its own name label, so identity never rests
// on color alone — no separate legend box needed. Bars are capped well under
// the 24px mark spec, rounded only at the data end and square at the
// baseline (the zero-width side), matching the app's rounded-only-once look
// used elsewhere (e.g. the iOS-style Switch track).
export default function CategoryBarChart({ data, emptyMessage = "No data yet.", labelWidth = 72 }) {
  if (!data.length) {
    return <p className="text-ink-soft dark:text-white/60 text-[.85rem] m-0">{emptyMessage}</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span
            className="shrink-0 text-[.78rem] font-bold text-ink-soft dark:text-white/60 truncate"
            style={{ width: labelWidth }}
            title={d.label}
          >
            {d.label}
          </span>
          <div className="flex-1 h-[18px] rounded-full bg-bg dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-r-[4px] [background:var(--bar-light)] dark:[background:var(--bar-dark)]"
              style={{
                width: `${Math.max((d.value / max) * 100, 3)}%`,
                "--bar-light": d.color.light,
                "--bar-dark": d.color.dark,
              }}
            />
          </div>
          <span className="w-8 shrink-0 text-right font-mono text-[.78rem] text-ink dark:text-white">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}
