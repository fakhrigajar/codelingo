import { motion } from 'framer-motion'
import { BADGES } from '../../lib/dailyChallengeProgress'
import { getBadgeIcon } from '../../lib/badgeIcons'

export default function AchievementBadges({ unlockedIds }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 className="text-[1.2rem] text-ink dark:text-white mb-5">Achievement Badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BADGES.map((badge, i) => {
          const unlocked = unlockedIds.has(badge.id)
          const Icon = getBadgeIcon(badge.icon)
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={unlocked ? { y: -3 } : undefined}
              className={[
                'rounded-2xl border p-4 text-center',
                unlocked
                  ? 'border-line dark:border-white/15 bg-bg dark:bg-white/[0.06]'
                  : 'border-line dark:border-white/5 bg-bg/60 dark:bg-white/[0.02]',
              ].join(' ')}
            >
              <span className={`flex justify-center text-violet mb-2 ${unlocked ? '' : 'blur-[3px] opacity-40 grayscale'}`}>
                <Icon size={28} />
              </span>
              <p className={`text-[.8rem] font-bold ${unlocked ? 'text-ink dark:text-white' : 'text-ink-soft/50 dark:text-white/30'}`}>{badge.name}</p>
              {!unlocked && <p className="text-[.68rem] text-ink-soft/40 dark:text-white/25 mt-1">{badge.desc}</p>}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
