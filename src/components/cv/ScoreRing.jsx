export default function ScoreRing({ score, size = 128, label = 'ATS Score' }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = score >= 80 ? '#2FC493' : score >= 50 ? '#FFC93C' : '#FF6B5B'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-line dark:stroke-white/10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-extrabold text-[1.6rem] text-ink dark:text-white">
            {score}
          </span>
          <span className="font-mono text-[.6rem] text-ink-soft dark:text-white/50">/ 100</span>
        </div>
      </div>
      <span className="font-bold text-[.85rem] text-ink-soft dark:text-white/60">{label}</span>
    </div>
  )
}
