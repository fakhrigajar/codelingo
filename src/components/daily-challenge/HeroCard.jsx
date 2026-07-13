import { motion } from 'framer-motion'
import { Flame, CheckCircle2 } from 'lucide-react'
import CountUp from './CountUp'

export default function HeroCard({ streak, todayXp, todayCoins, completedToday, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#241a4d] via-[#1B2647] to-[#100c24] px-6 py-9 sm:px-10 sm:py-12 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-coral/10 blur-3xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 bg-white/10 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full tracking-wide mb-4">
          <Flame size={14} /> Daily Coding Challenge
        </span>

        <p className="text-white/60 max-w-[520px] mb-7 text-[.95rem]">
          Complete one programming challenge every day to improve your coding skills and keep your
          streak alive.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <StatPill icon={<Flame size={16} className="text-coral" />} label="Current Streak" value={`${streak} Days`} />
          <StatPill label="Today's XP" value={<>+<CountUp value={completedToday ? todayXp : 0} duration={0.8} /> XP</>} accent="text-sun" />
          <StatPill label="Coins earned" value={<>+<CountUp value={completedToday ? todayCoins : 0} duration={0.8} /> Coins</>} accent="text-mint" />
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={onStart}
          disabled={completedToday}
          className="btn btn-primary text-[1.05rem] px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 inline-flex items-center justify-center gap-2"
        >
          {completedToday ? (
            <>
              <CheckCircle2 size={18} /> Today's Challenge Completed
            </>
          ) : (
            "Start Today's Challenge"
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

function StatPill({ icon, label, value, accent = 'text-white' }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
      {icon}
      <div className="leading-tight">
        <p className="text-[.68rem] font-bold text-white/45 uppercase tracking-wide">{label}</p>
        <p className={`font-mono font-extrabold text-[1.05rem] ${accent}`}>{value}</p>
      </div>
    </div>
  )
}
