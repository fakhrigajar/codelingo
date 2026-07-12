import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy: 'text-mint',
  Medium: 'text-sun',
  Hard: 'text-coral',
}

export default function ChallengeHistoryTable({ history }) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('All')

  const languages = useMemo(
    () => ['All', ...new Set(history.map((h) => h.language))],
    [history],
  )

  const filtered = useMemo(() => {
    return [...history]
      .reverse()
      .filter((h) => (language === 'All' ? true : h.language === language))
      .filter((h) => h.title.toLowerCase().includes(search.trim().toLowerCase()))
  }, [history, search, language])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-[1.2rem] text-ink dark:text-white">Challenge History</h2>

        <div className="flex flex-wrap gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50 dark:text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search challenges..."
              className="bg-bg dark:bg-white/5 border border-line dark:border-white/15 rounded-lg pl-8 pr-3 py-2 text-[.82rem] text-ink dark:text-white placeholder:text-ink-soft/50 dark:placeholder:text-white/30 outline-none focus:border-violet"
            />
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-bg dark:bg-white/5 border border-line dark:border-white/15 rounded-lg px-3 py-2 text-[.82rem] text-ink dark:text-white outline-none focus:border-violet"
          >
            {languages.map((l) => (
              <option key={l} value={l} className="bg-white dark:bg-[#1B2647]">
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-soft/60 dark:text-white/40 text-[.88rem] text-center py-8">
          {history.length === 0
            ? 'No challenges completed yet — finish today\'s to start your history.'
            : 'No challenges match your search.'}
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[520px] text-left border-collapse">
            <thead>
              <tr className="text-[.72rem] font-bold text-ink-soft/60 dark:text-white/40 uppercase tracking-wide">
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Challenge</th>
                <th className="px-2 py-2">Language</th>
                <th className="px-2 py-2">Difficulty</th>
                <th className="px-2 py-2">XP</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr key={`${h.date}-${h.challengeId}`} className={i % 2 === 0 ? 'bg-bg dark:bg-white/[0.02]' : ''}>
                  <td className="px-2 py-3 text-ink-soft dark:text-white/60 font-mono text-[.82rem] rounded-l-xl">{h.date}</td>
                  <td className="px-2 py-3 text-ink dark:text-white font-bold text-[.85rem]">{h.title}</td>
                  <td className="px-2 py-3 text-ink-soft dark:text-white/60 text-[.85rem]">{h.language}</td>
                  <td className={`px-2 py-3 font-bold text-[.85rem] ${DIFFICULTY_STYLES[h.difficulty]}`}>{h.difficulty}</td>
                  <td className="px-2 py-3 text-[#9A6B00] dark:text-sun font-mono text-[.85rem]">+{h.xp}</td>
                  <td className="px-2 py-3 rounded-r-xl">
                    <span className="text-[.75rem] font-bold text-mint bg-mint/10 border border-mint/25 rounded-full px-2.5 py-1">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
