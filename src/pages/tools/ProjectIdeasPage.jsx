import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectIdeaForm from '../../components/projects/ProjectIdeaForm'
import ProjectIdeaList from '../../components/projects/ProjectIdeaList'
import { generateProjectIdeas } from '../../lib/projectIdeas'

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
        <Link to="/tools" className="hover:text-violet dark:hover:text-violet">
          Tools
        </Link>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">Project Ideas</span>
      </nav>

      <span className="eyebrow">🤖 AI career tools</span>
      <h1 className="text-[2rem]">Project Ideas</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
        Pick a language and a level, and AI will generate 10 project ideas to build your skills.
      </p>

      <ProjectIdeaForm onGenerate={handleGenerate} status={status} />

      {error && (
        <div className="max-w-[560px] mx-auto bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mt-4 text-center">
          {error}
        </div>
      )}

      {ideas && (
        <>
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
        </>
      )}
    </div>
  )
}
