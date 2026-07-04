import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { courseById, lessonById, progressPct } from '../lib/helpers'
import LessonPanel from '../components/courses/LessonPanel'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { courses, badges } = useContent()
  const { currentUser, saveCurrentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeLessonId, setActiveLessonId] = useState(null)

  const course = courseById(courses, courseId)

  useEffect(() => {
    const lessonParam = searchParams.get('lesson')
    if (lessonParam && course && lessonById(course, lessonParam)) {
      setActiveLessonId(lessonParam)
      setTimeout(() => {
        document.getElementById('lesson-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, course?.id])

  if (!course) return <Navigate to="/courses" replace />

  const activeLesson = activeLessonId ? lessonById(course, activeLessonId) : null
  const pct = progressPct(currentUser, course)

  const handleOpenLesson = (lessonId) => {
    setActiveLessonId(lessonId)
    setTimeout(() => {
      document.getElementById('lesson-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleComplete = (course, lesson, xp, isQuiz) => {
    if (!currentUser) {
      toast('Log in to save your progress!')
      navigate('/account')
      return
    }
    if (currentUser.completed[course.id]?.includes(lesson.id)) return

    const updated = {
      ...currentUser,
      completed: { ...currentUser.completed, [course.id]: [...(currentUser.completed[course.id] || []), lesson.id] },
      xp: currentUser.xp + xp,
      badges: [...currentUser.badges],
    }

    const newBadges = []
    const totalCompleted = Object.values(updated.completed).reduce((a, arr) => a + arr.length, 0)
    if (totalCompleted === 1 && !updated.badges.includes('first-steps')) newBadges.push('first-steps')
    if (isQuiz && !updated.badges.includes('quiz-whiz')) newBadges.push('quiz-whiz')
    if (
      updated.completed[course.id].length === course.lessons.length &&
      !updated.badges.includes('course-champion')
    )
      newBadges.push('course-champion')
    const coursesTouched = Object.values(updated.completed).filter((arr) => arr.length > 0).length
    if (coursesTouched >= 3 && !updated.badges.includes('triple-threat')) newBadges.push('triple-threat')
    updated.badges.push(...newBadges)

    saveCurrentUser(updated)
    const badgeMsg = newBadges.length ? ` New badge: ${badges.find((b) => b.id === newBadges[0])?.name} 🎉` : ''
    toast(`+${xp} XP earned!${badgeMsg}`)
  }

  return (
    <div>
      <button className="btn btn-outline btn-sm mt-5" onClick={() => navigate('/courses')}>
        ← All courses
      </button>
      <div className="flex gap-6 items-start flex-wrap py-11 pb-5">
        <div
          className="w-[88px] h-[88px] rounded-[20px] flex items-center justify-center text-[2.6rem] flex-shrink-0"
          style={{ background: `${course.color}33` }}
        >
          {course.icon}
        </div>
        <div className="flex-1 min-w-[220px]">
          <span className="eyebrow">{course.level}</span>
          <h1 className="text-[1.9rem]">{course.title}</h1>
          <p className="text-ink-soft dark:text-white/60 max-w-[520px]">{course.blurb}</p>
        </div>
      </div>
      <div className="h-2 bg-line dark:bg-white/10 rounded-md overflow-hidden max-w-[400px]">
        <div className="h-full bg-mint rounded-md" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-col gap-3 mt-6">
        {course.lessons.map((l) => {
          const done = currentUser && (currentUser.completed[course.id] || []).includes(l.id)
          return (
            <div
              key={l.id}
              onClick={() => handleOpenLesson(l.id)}
              className="flex items-center gap-4 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl px-4.5 px-[18px] py-4 cursor-pointer transition-colors hover:border-violet"
            >
              <div
                className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[.9rem] ${
                  done ? 'bg-mint border-mint text-white' : 'border-line dark:border-white/15'
                }`}
              >
                {done ? '✓' : ''}
              </div>
              <div className="font-bold flex-1">{l.title}</div>
              <div className="font-mono text-xs text-ink-soft dark:text-white/60">{l.type === 'quiz' ? 'QUIZ' : 'LESSON'}</div>
            </div>
          )
        })}
      </div>
      {activeLesson && (
        <div id="lesson-panel">
          <LessonPanel course={course} lesson={activeLesson} currentUser={currentUser} onComplete={handleComplete} />
        </div>
      )}
    </div>
  )
}
