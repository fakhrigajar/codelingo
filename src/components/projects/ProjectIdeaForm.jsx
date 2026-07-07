import { useState } from 'react'

const LEVELS = [
  { id: 'basic', label: 'Basic' },
  { id: 'medium', label: 'Medium' },
  { id: 'advanced', label: 'Advanced' },
]

export default function ProjectIdeaForm({ onGenerate, status }) {
  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('basic')
  const [detailed, setDetailed] = useState(false)

  const handleSubmit = () => {
    if (!language.trim()) return
    onGenerate({ language: language.trim(), level, detailed })
  }

  return (
    <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
      <div className="field mb-4">
        <label>Programming language</label>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. Python, JavaScript, Go"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold text-sm mb-1.5 text-ink-soft dark:text-white/60">Level</label>
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[.88rem] border-2 transition-colors ${
                level === l.id
                  ? 'bg-violet/15 border-violet text-violet'
                  : 'border-line dark:border-white/15 text-ink-soft dark:text-white/60 hover:border-violet/50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={detailed}
          onChange={(e) => setDetailed(e.target.checked)}
          className="w-4 h-4 accent-violet"
        />
        <span className="text-[.88rem] font-bold text-ink-soft dark:text-white/60">
          Give more detailed descriptions
        </span>
      </label>

      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={handleSubmit}
        disabled={!language.trim() || status === 'loading'}
      >
        {status === 'loading' ? 'Generating ideas...' : 'Generate 10 project ideas'}
      </button>
    </div>
  )
}
