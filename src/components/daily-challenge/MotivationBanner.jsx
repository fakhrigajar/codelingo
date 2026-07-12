import { motion } from 'framer-motion'

export default function MotivationBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-violet via-[#7A6AD8] to-coral px-7 py-9 sm:px-10 text-center"
    >
      <p className="text-white/70 font-mono text-[.75rem] font-bold uppercase tracking-widest mb-3">
        Keep going
      </p>
      <p className="text-white text-[1.3rem] sm:text-[1.5rem] font-display max-w-[560px] mx-auto leading-snug">
        "Consistency beats intensity. Complete today's challenge and continue your journey."
      </p>
    </motion.div>
  )
}
