import { motion } from 'framer-motion'
import { CheckCircle, Percent, Clock3, Flame } from 'lucide-react'
import CountUp from './CountUp'

export default function WeeklyStats({ stats }) {
  const cards = [
    { icon: <CheckCircle size={18} className="text-mint" />, label: 'Challenges Completed', value: stats.completed },
    { icon: <Percent size={18} className="text-violet" />, label: 'Success Rate', value: stats.successRate, suffix: '%' },
    { icon: <Clock3 size={18} className="text-sun" />, label: 'Coding Time', value: stats.minutes, suffix: ' min' },
    { icon: <Flame size={18} className="text-coral" />, label: 'Longest Streak', value: stats.longestStreak, suffix: ' days' },
  ]

  return (
    <div>
      <h2 className="text-[1.2rem] text-ink dark:text-white mb-5">Weekly Statistics</h2>
      <div className="grid sm:grid-cols-2 desktop:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-[20px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-5"
          >
            <div className="flex items-center gap-2 text-ink-soft dark:text-white/50 text-[.78rem] font-bold mb-2">
              {c.icon}
              {c.label}
            </div>
            <p className="font-mono font-extrabold text-[1.6rem] text-ink dark:text-white">
              <CountUp value={c.value} duration={0.9} />
              {c.suffix}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
