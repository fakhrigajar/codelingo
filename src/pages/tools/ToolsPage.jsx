import { Link } from 'react-router-dom'

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
]

export default function ToolsPage() {
  return (
    <div className="py-8">
      <span className="eyebrow">🤖 AI career tools</span>
      <h1 className="text-[2rem]">Tools</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
        A growing set of AI-powered tools to help you land the job — more on the way.
      </p>

      <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6 hover:border-violet transition-colors"
          >
            <span className="text-3xl">{tool.icon}</span>
            <h3 className="text-[1.15rem] mt-3 mb-1.5">{tool.title}</h3>
            <p className="text-ink-soft dark:text-white/60 text-[.88rem]">{tool.description}</p>
          </Link>
        ))}

        <div className="border-2 border-dashed border-line dark:border-white/15 rounded-[18px] p-6 flex flex-col items-center justify-center text-center">
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
