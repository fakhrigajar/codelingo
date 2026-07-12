import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function StreakCalendar({ days, firstWeekday, monthLabel, streak }) {
  const leadingBlanks = Array.from({ length: firstWeekday })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[1.2rem] text-ink dark:text-white">{monthLabel}</h2>
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-lg"
          >
            🔥
          </motion.span>
          <span className="font-mono font-bold text-ink-soft dark:text-white/70 text-[.9rem]">{streak} day streak</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-[.7rem] font-bold text-ink-soft/60 dark:text-white/35">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((d) => (
          <div
            key={d.day}
            className={[
              'aspect-square rounded-xl flex items-center justify-center text-[.8rem] font-bold relative',
              d.isToday
                ? 'bg-violet text-white shadow-[0_0_0_3px_rgba(140,122,230,.3)]'
                : d.isCompleted
                  ? 'bg-mint/20 text-mint border border-mint/30'
                  : d.isMissed
                    ? 'bg-bg dark:bg-white/[0.03] text-ink-soft/40 dark:text-white/25 border border-line dark:border-white/5'
                    : 'text-ink-soft/60 dark:text-white/40 border border-line dark:border-white/5',
            ].join(' ')}
          >
            {d.isToday && <Flame size={10} className="absolute -top-1.5 -right-1.5 text-sun" />}
            {d.day}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-5 text-[.75rem] font-bold text-ink-soft dark:text-white/50">
        <Legend swatch="bg-mint/20 border border-mint/30" label="Completed" />
        <Legend swatch="bg-bg dark:bg-white/[0.03] border border-line dark:border-white/5" label="Missed" />
        <Legend swatch="bg-violet" label="Today" />
      </div>
    </motion.div>
  )
}

function Legend({ swatch, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-md ${swatch}`} />
      {label}
    </div>
  )
}
