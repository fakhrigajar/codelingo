import { useState } from 'react'
import { Bot } from 'lucide-react'
import InterviewSetupForm from '../../components/interview/InterviewSetupForm'
import InterviewQuizGame from '../../components/interview/InterviewQuizGame'
import FadeIn from '../../components/common/FadeIn'

export default function InterviewPrepPage() {
  const [session, setSession] = useState(null) // { role, questions }

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <span>Tools</span>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">Interview Prep</span>
      </nav>

      <FadeIn delay={0.05}>
        <span className="eyebrow">
          <Bot size={13} /> AI career tools
        </span>
        <h1 className="text-[2rem]">Interview Prep</h1>
        <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
          Get AI-generated interview FAQs for any role, then quiz yourself game-style to check your
          knowledge.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        {session ? (
          <InterviewQuizGame
            role={session.role}
            questions={session.questions}
            onRestart={() => setSession(null)}
          />
        ) : (
          <InterviewSetupForm onReady={setSession} />
        )}
      </FadeIn>
    </div>
  )
}
