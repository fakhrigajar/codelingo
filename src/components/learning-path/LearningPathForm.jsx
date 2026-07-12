import { useState } from 'react'

const EXPERIENCE_OPTIONS = [
  'Complete beginner',
  'Some experience',
  'Intermediate',
  'Advanced',
]

export default function LearningPathForm({ onGenerate, status }) {
  const [age, setAge] = useState('')
  const [experience, setExperience] = useState('')
  const [goal, setGoal] = useState('')

  const canSubmit = age.trim() && experience && goal.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    onGenerate({ age: age.trim(), experience, goal: goal.trim() })
  }

  return (
    <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
      <div className="grid sm:grid-cols-2 gap-3.5 mb-2">
        <div className="field">
          <label>Age</label>
          <input
            type="number"
            min="5"
            max="99"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 22"
          />
        </div>
        <div className="field">
          <label>Experience level</label>
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="">Select...</option>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field mb-5">
        <label>What's your goal?</label>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. I want to become a Frontend Developer"
        />
      </div>

      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={handleSubmit}
        disabled={!canSubmit || status === 'loading'}
      >
        {status === 'loading' ? 'Building your path...' : 'Create my learning path'}
      </button>
    </div>
  )
}
