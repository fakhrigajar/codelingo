import QuizPanel from './QuizPanel'

export default function LessonPanel({ course, lesson, currentUser, onComplete }) {
  const done = currentUser && (currentUser.completed[course.id] || []).includes(lesson.id)

  if (lesson.type === 'quiz') {
    return (
      <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 mt-6">
        <QuizPanel lesson={lesson} done={done} onComplete={(xp, isQuiz) => onComplete(course, lesson, xp, isQuiz)} />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 mt-6">
      <span className="eyebrow">📖 lesson</span>
      <h2>{lesson.title}</h2>
      <p className="text-[1.02rem]">{lesson.body}</p>
      <div className="bg-[#FFF3D6] text-[#8A5B00] dark:bg-[#3A2E12] dark:text-[#FFD98A] rounded-xl px-4 py-3.5 mb-4">💡 Fun fact: {lesson.fact}</div>
      <button
        className={`btn ${done ? 'btn-outline' : 'btn-primary'}`}
        disabled={done}
        onClick={() => !done && onComplete(course, lesson, 10, false)}
      >
        {done ? '✓ Completed' : 'Mark as complete (+10 XP)'}
      </button>
      {!currentUser && (
        <p className="text-[.82rem] text-ink-soft dark:text-white/50 mt-3">Log in to save your progress.</p>
      )}
    </div>
  )
}
