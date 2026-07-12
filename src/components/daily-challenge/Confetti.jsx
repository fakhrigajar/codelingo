import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#FF6B5B', '#FFC93C', '#2FC493', '#8C7AE6', '#5AA9FF']
const PARTICLE_COUNT = 32

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 360,
    y: Math.random() * -280 - 60,
    rotate: Math.random() * 360,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.15,
  }))
}

// `trigger` is a value that changes (e.g. a counter) each time a burst should fire.
export default function Confetti({ trigger }) {
  const [burst, setBurst] = useState(null)

  useEffect(() => {
    if (!trigger) return undefined
    setBurst({ id: trigger, particles: makeParticles() })
    const t = setTimeout(() => setBurst(null), 1300)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      <AnimatePresence>
        {burst && (
          <div className="absolute left-1/2 top-1/3">
            {burst.particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: p.color }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
                transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
