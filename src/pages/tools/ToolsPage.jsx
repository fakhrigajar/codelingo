import { Link, useNavigate } from 'react-router-dom'
import { Bot, FileText, Mic, Lightbulb, Map, Flame, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const TOOLS = [
  {
    to: '/tools/cv-analyzer',
    Icon: FileText,
    title: 'AI CV Analyzer',
    description: 'Upload your CV and get a live ATS-friendliness score with AI-powered feedback.',
  },
  {
    to: '/tools/interview-prep',
    Icon: Mic,
    title: 'Interview Prep',
    description: 'AI generates interview FAQs for any role, then quiz yourself game-style.',
  },
  {
    to: '/tools/project-ideas',
    Icon: Lightbulb,
    title: 'Project Ideas',
    description: 'Pick a language and a level, and get 10 AI-generated project ideas to build.',
  },
  {
    to: '/tools/learning-path',
    Icon: Map,
    title: 'Learning Path',
    description: 'Share your age, experience, and goal — get a personalized step-by-step path.',
  },
  {
    to: '/tools/daily-challenge',
    Icon: Flame,
    title: 'Daily Coding Challenge',
    description: 'A new challenge every day — build streaks, earn XP, and climb the leaderboard.',
  },
]

export default function ToolsPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="py-8">
      <span className="eyebrow">
        <Bot size={13} /> AI career tools
      </span>
      <h1 className="text-[2rem]">Tools</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-3">
        A growing set of AI-powered tools to help you land the job — more on the way.
      </p>

      {!currentUser && (
        <div className="flex items-center gap-3 bg-[#FFF3D6] text-[#8A5B00] dark:bg-white/10 dark:text-[#FFD98A] rounded-xl px-4 py-3 mb-6 max-w-[640px]">
          <Lock size={16} />
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
            className="relative block h-full overflow-hidden bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[22px] p-6 hover:border-violet hover:-translate-y-1 transition-all"
          >
            <div
              className="absolute inset-0 opacity-70 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(140,122,230,0.16) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                maskImage: 'linear-gradient(to bottom right, black, transparent 65%)',
                WebkitMaskImage: 'linear-gradient(to bottom right, black, transparent 65%)',
              }}
            />
            <tool.Icon
              size={170}
              strokeWidth={1}
              className="absolute -right-9 -bottom-10 text-violet/10 dark:text-white/[0.06] rotate-[18deg] pointer-events-none"
            />

            {!currentUser && (
              <span
                className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-line dark:border-white/15 bg-white/80 dark:bg-white/5 flex items-center justify-center text-ink-soft dark:text-white/50"
                title="Log in required"
              >
                <Lock size={16} />
              </span>
            )}

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet/10 flex items-center justify-center">
                <tool.Icon size={22} className="text-violet" />
              </div>
              <h3 className="text-[1.15rem] mt-4 mb-1.5">{tool.title}</h3>
              <p className="text-ink-soft dark:text-white/60 text-[.88rem]">{tool.description}</p>
            </div>
          </Link>
        ))}

        <div className="border-2 border-dashed border-line dark:border-white/15 rounded-[18px] p-6 flex flex-col items-center justify-center text-center h-full">
          <Sparkles size={28} className="text-ink-soft dark:text-white/50" />
          <h3 className="text-[1.15rem] mt-3 mb-1.5 text-ink-soft dark:text-white/60">More coming soon</h3>
          <p className="text-ink-soft dark:text-white/50 text-[.88rem]">
            New AI tools are on the way.
          </p>
        </div>
      </div>
    </div>
  )
}
