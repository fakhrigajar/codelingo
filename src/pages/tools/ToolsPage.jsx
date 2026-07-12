import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TOOLS = [
  {
    to: '/tools/cv-analyzer',
    icon: '📄',
    title: 'AI CV Analyzer',
    description: 'Upload your CV and get a live ATS-friendliness score with AI-powered feedback.',
  },
  {
    to: '/tools/interview-prep',
    icon: '🎤',
    title: 'Interview Prep',
    description: 'AI generates interview FAQs for any role, then quiz yourself game-style.',
  },
  {
    to: '/tools/project-ideas',
    icon: '💡',
    title: 'Project Ideas',
    description: 'Pick a language and a level, and get 10 AI-generated project ideas to build.',
  },
  {
    to: '/tools/learning-path',
    icon: '🗺️',
    title: 'Learning Path',
    description: 'Share your age, experience, and goal — get a personalized step-by-step path.',
  },
  {
    to: '/tools/daily-challenge',
    icon: '🔥',
    title: 'Daily Coding Challenge',
    description: 'A new challenge every day — build streaks, earn XP, and climb the leaderboard.',
  },
]

export default function ToolsPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="py-8">
      <span className="eyebrow">🤖 AI career tools</span>
      <h1 className="text-[2rem]">Tools</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-3">
        A growing set of AI-powered tools to help you land the job — more on the way.
      </p>

      {!currentUser && (
        <div className="flex items-center gap-3 bg-[#FFF3D6] text-[#8A5B00] dark:bg-white/10 dark:text-[#FFD98A] rounded-xl px-4 py-3 mb-6 max-w-[640px]">
          <span>🔒</span>
          <span className="text-[.88rem] font-bold flex-1">Log in to use these tools.</span>
          <button className="btn btn-dark btn-sm" onClick={() => navigate('/account')}>
            Log in
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="relative block h-full bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6 hover:border-violet hover:-translate-y-1 transition-all"
          >
            {!currentUser && (
              <span
                className="absolute top-4 right-4 text-[1.1rem]"
                title="Log in required"
              >
                🔒
              </span>
            )}
            <span className="text-3xl">{tool.icon}</span>
            <h3 className="text-[1.15rem] mt-3 mb-1.5">{tool.title}</h3>
            <p className="text-ink-soft dark:text-white/60 text-[.88rem]">{tool.description}</p>
          </Link>
        ))}

        <div className="border-2 border-dashed border-line dark:border-white/15 rounded-[18px] p-6 flex flex-col items-center justify-center text-center h-full">
          <span className="text-3xl">✨</span>
          <h3 className="text-[1.15rem] mt-3 mb-1.5 text-ink-soft dark:text-white/60">More coming soon</h3>
          <p className="text-ink-soft dark:text-white/50 text-[.88rem]">
            New AI tools are on the way.
          </p>
        </div>
      </div>
    </div>
  )
}
