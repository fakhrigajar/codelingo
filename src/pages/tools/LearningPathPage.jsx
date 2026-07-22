import { useState } from 'react'
import { Bot } from 'lucide-react'
import LearningPathForm from '../../components/learning-path/LearningPathForm'
import LearningPathDiagram from '../../components/learning-path/LearningPathDiagram'
import { generateLearningPath } from '../../lib/learningPath'
import FadeIn from '../../components/common/FadeIn'

export default function LearningPathPage() {
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')
  const [steps, setSteps] = useState(null)
  const [goal, setGoal] = useState('')

  const handleGenerate = async (request) => {
    setStatus('loading')
    setError('')
    setGoal(request.goal)
    try {
      const result = await generateLearningPath(request)
      setSteps(result)
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <span>Tools</span>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">Learning Path</span>
      </nav>

      <FadeIn delay={0.05}>
        <span className="eyebrow">
          <Bot size={13} /> AI career tools
        </span>
        <h1 className="text-[2rem]">Learning Path</h1>
        <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
          Tell us your age, experience, and goal — AI builds a personalized step-by-step path to get
          you there.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <LearningPathForm onGenerate={handleGenerate} status={status} />
      </FadeIn>

      {error && (
        <FadeIn
          delay={0.25}
          className="max-w-[560px] mx-auto bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mt-4 text-center"
        >
          {error}
        </FadeIn>
      )}

      {steps && (
        <FadeIn delay={0.35} className="mt-9">
          <LearningPathDiagram goal={goal} steps={steps} />
        </FadeIn>
      )}
    </div>
  )
}
