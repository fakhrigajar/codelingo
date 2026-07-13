import { useState } from 'react'
import { Flag, CheckCircle2, XCircle, PartyPopper } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { recordGap } from '../../lib/interviewGaps'

export default function InterviewQuizGame({ role, questions, onRestart }) {
  const { currentUser } = useAuth()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  const finished = index >= questions.length
  const current = questions[index]

  const handleSelect = (oi) => {
    if (selected !== null) return
    setSelected(oi)
    if (oi === current.correctIndex) {
      setScore((s) => s + 1)
    } else if (currentUser) {
      recordGap(currentUser.username, {
        title: current.topic || current.question,
        question: current.question,
        role,
      })
    }
  }

  const handleNext = () => {
    setSelected(null)
    setIndex((i) => i + 1)
  }

  const handlePlayAgain = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const ready = pct >= 80
    const message = ready
      ? "You're interview-ready!"
      : pct >= 50
        ? 'Solid start — keep practicing!'
        : "Let's review and try again."

    return (
      <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-8 text-center">
        <div className="flex justify-center text-violet">
          {ready ? <PartyPopper size={40} /> : <Flag size={40} />}
        </div>
        <h2 className="text-[1.4rem] mt-3 mb-1">
          You scored {score}/{questions.length}
        </h2>
        <p className="text-ink-soft dark:text-white/60 mb-6">{message}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button type="button" className="btn btn-outline" onClick={handlePlayAgain}>
            Play again
          </button>
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            New topic
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="flex items-center justify-between mb-3 font-mono text-[.78rem] text-ink-soft dark:text-white/50">
        <span>
          {role} · Question {index + 1}/{questions.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="h-2 bg-line dark:bg-white/10 rounded-md overflow-hidden mb-6">
        <div
          className="h-full rounded-md bg-violet transition-[width]"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
        <p className="font-extrabold text-[1.05rem] mb-5">{current.question}</p>

        <div className="space-y-2.5 mb-2">
          {current.options.map((opt, oi) => {
            let extra = ''
            if (selected !== null) {
              if (oi === current.correctIndex) {
                extra = 'bg-[#E4FBF2] border-mint text-[#0B7A55] dark:bg-[#0B3B2E] dark:text-[#6EE7B7]'
              } else if (oi === selected) {
                extra = 'bg-[#FFEDEB] border-coral text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5]'
              }
            }
            return (
              <button
                key={oi}
                type="button"
                disabled={selected !== null}
                onClick={() => handleSelect(oi)}
                className={`flex items-center gap-3 w-full text-left bg-bg dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl px-4 py-3.5 font-bold text-ink dark:text-white hover:border-violet disabled:cursor-default transition-colors ${extra}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="bg-bg dark:bg-white/10 rounded-xl px-4 py-3.5 mt-4 text-[.88rem]">
            <span className="font-extrabold inline-flex items-center gap-1.5">
              {selected === current.correctIndex ? (
                <>
                  <CheckCircle2 size={15} className="text-mint" /> Correct!
                </>
              ) : (
                <>
                  <XCircle size={15} className="text-coral" /> Not quite.
                </>
              )}
            </span>{' '}
            {current.explanation}
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={handleNext}
          disabled={selected === null}
        >
          {index === questions.length - 1 ? 'See results' : 'Next question'}
        </button>
      </div>
    </div>
  )
}
