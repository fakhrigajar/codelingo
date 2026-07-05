import { useState } from 'react'

export default function QuizPanel({ lesson, done, onComplete }) {
  const [answers, setAnswers] = useState(() => new Array(lesson.questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  if (done) {
    return (
      <>
        <span className="eyebrow">🧠 quiz</span>
        <h2>{lesson.title}</h2>
        <p className="text-mint font-extrabold">✓ Quiz already completed — nice work!</p>
      </>
    )
  }

  const allAnswered = answers.every((a) => a !== null)
  const correctCount = answers.reduce((acc, a, i) => acc + (a === lesson.questions[i].correct ? 1 : 0), 0)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => onComplete(20, true), 900)
  }

  return (
    <>
      <span className="eyebrow">🧠 quiz</span>
      <h2>{lesson.title}</h2>
      {lesson.questions.map((q, qi) => (
        <div key={qi} className="mb-5">
          <p className="font-extrabold">
            {qi + 1}. {q.q}
          </p>
          <div>
            {q.options.map((opt, oi) => {
              let extra = ''
              if (submitted) {
                if (oi === q.correct) extra = 'bg-[#E4FBF2] border-mint text-[#0B7A55] dark:bg-[#0B3B2E] dark:text-[#6EE7B7]'
                else if (oi === answers[qi]) extra = 'bg-[#FFEDEB] border-coral text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5]'
              } else if (answers[qi] === oi) {
                extra = 'border-violet bg-violet/10 text-violet dark:bg-violet/20 dark:text-white ring-2 ring-violet/30'
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => {
                    if (submitted) return
                    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
                  }}
                  className={`flex items-center gap-3 w-full text-left bg-bg dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl px-4 py-3.5 mb-2.5 font-bold text-ink dark:text-white hover:border-violet disabled:cursor-default ${extra}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[qi] === oi && !submitted
                        ? 'border-violet bg-violet'
                        : 'border-line dark:border-white/25'
                    }`}
                  >
                    {answers[qi] === oi && !submitted && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <button
        className="btn btn-primary"
        disabled={!allAnswered || submitted}
        onClick={handleSubmit}
      >
        {submitted
          ? `Score: ${correctCount}/${lesson.questions.length}`
          : allAnswered
          ? 'Submit answers'
          : 'Answer all questions to submit'}
      </button>
    </>
  )
}
