import { useState } from 'react'
import { generateInterviewQuestions } from '../../lib/interviewPrep'

const SUGGESTIONS = ['Frontend Developer', 'Backend Developer', 'Data Analyst', 'Product Manager']

export default function InterviewSetupForm({ onReady }) {
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!role.trim()) return
    setStatus('loading')
    setError('')
    try {
      const questions = await generateInterviewQuestions({ role })
      onReady({ role: role.trim(), questions })
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 text-center">
      <span className="text-3xl">🎤</span>
      <h2 className="text-[1.3rem] mt-2 mb-1.5">What role are you interviewing for?</h2>
      <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-5">
        AI will generate a set of common interview questions so you can quiz yourself.
      </p>

      <div className="field text-left mb-3">
        <label>Role or topic</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g. Frontend Developer, React, Behavioral"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRole(s)}
            className="px-3 py-1.5 rounded-full font-bold text-[.78rem] bg-bg dark:bg-white/10 text-ink-soft dark:text-white/60 hover:bg-violet/15 hover:text-violet transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4 text-left">
          {error}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={handleGenerate}
        disabled={!role.trim() || status === 'loading'}
      >
        {status === 'loading' ? 'Generating questions...' : 'Generate questions'}
      </button>
    </div>
  )
}
