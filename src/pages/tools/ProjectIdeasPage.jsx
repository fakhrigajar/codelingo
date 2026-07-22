import { useState } from 'react'
import { Bot } from 'lucide-react'
import ProjectIdeaForm from '../../components/projects/ProjectIdeaForm'
import ProjectIdeaList from '../../components/projects/ProjectIdeaList'
import { generateProjectIdeas } from '../../lib/projectIdeas'
import FadeIn from '../../components/common/FadeIn'

export default function ProjectIdeasPage() {
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')
  const [ideas, setIdeas] = useState(null)
  const [lastRequest, setLastRequest] = useState(null)

  const handleGenerate = async (request) => {
    setStatus('loading')
    setError('')
    setLastRequest(request)
    try {
      const result = await generateProjectIdeas(request)
      setIdeas(result)
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
        <span className="text-ink dark:text-white">Project Ideas</span>
      </nav>

      <FadeIn delay={0.05}>
        <span className="eyebrow">
          <Bot size={13} /> AI career tools
        </span>
        <h1 className="text-[2rem]">Project Ideas</h1>
        <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
          Pick a language and a level, and AI will generate 10 project ideas to build your skills.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <ProjectIdeaForm onGenerate={handleGenerate} status={status} />
      </FadeIn>

      {error && (
        <FadeIn
          delay={0.25}
          className="max-w-[560px] mx-auto bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mt-4 text-center"
        >
          {error}
        </FadeIn>
      )}

      {ideas && (
        <FadeIn delay={0.35} as="div">
          <ProjectIdeaList ideas={ideas} />
          <div className="text-center mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => lastRequest && handleGenerate(lastRequest)}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Generating...' : 'Generate 10 more'}
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
