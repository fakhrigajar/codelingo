import { motion } from 'framer-motion'
import { Flame, Medal } from 'lucide-react'

const MEDAL_STYLES = ['text-sun', 'text-ink-soft dark:text-white/50', 'text-coral']

function initials(name) {
  return (name || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function LeaderboardTable({ entries }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 className="text-[1.2rem] text-ink dark:text-white mb-5">Leaderboard</h2>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[520px] text-left border-collapse">
          <thead>
            <tr className="text-[.72rem] font-bold text-ink-soft/60 dark:text-white/40 uppercase tracking-wide">
              <th className="px-2 py-2 w-12">Rank</th>
              <th className="px-2 py-2">User</th>
              <th className="px-2 py-2">Level</th>
              <th className="px-2 py-2">XP</th>
              <th className="px-2 py-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <motion.tr
                key={entry.username}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={[
                  'text-[.9rem]',
                  entry.isYou ? 'bg-violet/15' : i % 2 === 0 ? 'bg-bg dark:bg-white/[0.02]' : '',
                ].join(' ')}
              >
                <td className="px-2 py-3 font-mono font-bold text-ink-soft dark:text-white/60 rounded-l-xl">
                  {entry.rank <= 3 ? <Medal size={16} className={MEDAL_STYLES[entry.rank - 1]} /> : `#${entry.rank}`}
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-line dark:bg-white/10 flex items-center justify-center font-mono text-[.7rem] font-bold text-ink-soft dark:text-white/70">
                      {initials(entry.displayName)}
                    </span>
                    <span className={`font-bold ${entry.isYou ? 'text-violet' : 'text-ink dark:text-white'}`}>
                      {entry.displayName}
                      {entry.isYou && <span className="text-[.7rem] text-ink-soft/60 dark:text-white/40 font-normal"> (you)</span>}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3 text-ink-soft dark:text-white/70 font-mono">{entry.level}</td>
                <td className="px-2 py-3 text-ink-soft dark:text-white/70 font-mono">{entry.xp.toLocaleString()}</td>
                <td className="px-2 py-3 text-ink-soft dark:text-white/70 font-mono rounded-r-xl">
                  <span className="inline-flex items-center gap-1">
                    <Flame size={13} className="text-coral" /> {entry.streak}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
