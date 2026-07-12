import { motion } from 'framer-motion'
import { Gift, Lock } from 'lucide-react'
import { REWARD_MILESTONES } from '../../lib/dailyChallengeProgress'

export default function RewardsTimeline({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 className="text-[1.2rem] text-ink dark:text-white mb-6">Rewards</h2>

      <div className="relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-line dark:bg-white/10" />
        <div className="flex flex-col gap-6">
          {REWARD_MILESTONES.map((m, i) => {
            const achieved = m.check(progress)
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <span
                  className={[
                    'absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2',
                    achieved ? 'bg-mint border-mint' : 'bg-white dark:bg-[#1B2647] border-line dark:border-white/15',
                  ].join(' ')}
                >
                  {achieved ? (
                    <Gift size={12} className="text-white" />
                  ) : (
                    <Lock size={11} className="text-ink-soft/50 dark:text-white/40" />
                  )}
                </span>
                <p className={`font-bold text-[.95rem] ${achieved ? 'text-ink dark:text-white' : 'text-ink-soft/50 dark:text-white/40'}`}>{m.label}</p>
                <p className={`text-[.82rem] ${achieved ? 'text-[#9A6B00] dark:text-sun' : 'text-ink-soft/40 dark:text-white/25'}`}>{m.reward}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
