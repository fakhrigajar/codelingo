import { motion } from 'framer-motion'
import { Trophy, Zap, TrendingUp } from 'lucide-react'
import CountUp from './CountUp'

export default function ProgressStats({ xp, level }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <StatCard icon={<Trophy size={20} className="text-sun" />} label="Current Level" value={<CountUp value={level.level} duration={0.8} />} delay={0} />
      <StatCard icon={<Zap size={20} className="text-violet" />} label="Current XP" value={<CountUp value={xp} duration={1} />} delay={0.08} />
      <StatCard icon={<TrendingUp size={20} className="text-mint" />} label="Next Level" delay={0.16}>
        <div className="mt-2">
          <div className="flex justify-between text-[.75rem] font-bold text-ink-soft dark:text-white/50 mb-1.5">
            <span>{level.into} XP</span>
            <span>{level.target} XP</span>
          </div>
          <div className="h-2.5 rounded-full bg-line dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet to-coral"
              initial={{ width: 0 }}
              animate={{ width: `${level.percent}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>
      </StatCard>
    </div>
  )
}

function StatCard({ icon, label, value, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      className="rounded-[20px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-5"
    >
      <div className="flex items-center gap-2 text-ink-soft dark:text-white/50 text-[.8rem] font-bold mb-2">
        {icon}
        {label}
      </div>
      {value !== undefined && (
        <p className="font-mono font-extrabold text-[1.8rem] text-ink dark:text-white">{value}</p>
      )}
      {children}
    </motion.div>
  )
}
