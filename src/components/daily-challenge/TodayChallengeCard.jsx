import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Sparkles, Coins, Lock, CheckCircle2 } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy: 'bg-mint/15 text-mint border-mint/30',
  Medium: 'bg-sun/15 text-sun border-sun/30',
  Hard: 'bg-coral/15 text-coral border-coral/30',
}

export default function TodayChallengeCard({ challenge, status, onStart, onComplete, sectionRef }) {
  const [showSolution, setShowSolution] = useState(false)

  const started = status === 'started' || status === 'completed'
  const completed = status === 'completed'

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-[1.3rem] text-ink dark:text-white">Today's Challenge</h2>
        {completed && (
          <span className="flex items-center gap-1.5 text-mint text-[.8rem] font-bold">
            <CheckCircle2 size={16} /> Completed
          </span>
        )}
      </div>

      <h3 className="text-[1.5rem] font-display text-ink dark:text-white mt-3 mb-3">{challenge.title}</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`text-[.75rem] font-bold px-2.5 py-1 rounded-full border ${DIFFICULTY_STYLES[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="text-[.75rem] font-bold px-2.5 py-1 rounded-full border border-line dark:border-white/15 text-ink-soft dark:text-white/70 bg-bg dark:bg-white/5">
          {challenge.language}
        </span>
        <span className="flex items-center gap-1 text-[.75rem] font-bold px-2.5 py-1 rounded-full border border-line dark:border-white/15 text-ink-soft dark:text-white/70 bg-bg dark:bg-white/5">
          <Clock size={13} /> {challenge.minutes} minutes
        </span>
        <span className="flex items-center gap-1 text-[.75rem] font-bold px-2.5 py-1 rounded-full border border-sun/25 text-[#9A6B00] dark:text-sun bg-sun/10">
          <Sparkles size={13} /> +{challenge.xp} XP
        </span>
        <span className="flex items-center gap-1 text-[.75rem] font-bold px-2.5 py-1 rounded-full border border-mint/25 text-mint bg-mint/10">
          <Coins size={13} /> +{challenge.coins} Coins
        </span>
      </div>

      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-ink-soft dark:text-white/70 text-[.92rem] leading-relaxed bg-bg dark:bg-black/20 border border-line dark:border-white/10 rounded-2xl p-4 mb-4">
              {challenge.prompt}
            </p>

            <AnimatePresence>
              {showSolution && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden text-violet text-[.9rem] leading-relaxed bg-violet/10 border border-violet/20 rounded-2xl p-4 mb-4"
                >
                  💡 {challenge.solution}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        {!completed ? (
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={started ? onComplete : onStart}
            className="btn btn-primary"
          >
            {started ? 'Mark as Complete' : 'Start Challenge'}
          </motion.button>
        ) : (
          <button type="button" disabled className="btn btn-primary opacity-60 cursor-not-allowed">
            ✓ Challenge Completed
          </button>
        )}

        <button
          type="button"
          disabled={!completed}
          onClick={() => setShowSolution((s) => !s)}
          className="btn btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {!completed && <Lock size={14} className="mr-1.5 inline" />}
          {showSolution ? 'Hide Solution' : 'View Solution'}
        </button>
      </div>
    </motion.div>
  )
}
