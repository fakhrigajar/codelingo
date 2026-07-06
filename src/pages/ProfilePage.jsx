import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { initials } from '../lib/helpers'
import CourseCard from '../components/courses/CourseCard'

export default function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const { courses, badges } = useContent()
  const toast = useToast()
  const navigate = useNavigate()

  if (!currentUser) return null

  const totalCompleted = Object.values(currentUser.completed).reduce((a, arr) => a + arr.length, 0)
  const studyingCourses = courses.filter((c) => (currentUser.completed[c.id] || []).length > 0)

  const handleLogout = () => {
    navigate('/')
    logout()
    toast('Logged out. See you soon!')
  }

  return (
    <div>
      <div className="flex gap-6 items-center py-11 pb-7 flex-wrap">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet to-coral flex items-center justify-center text-white text-[2.2rem] font-extrabold">
          {initials(currentUser.displayName)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-[1.9rem]">{currentUser.displayName}</h1>
          <p className="font-mono text-ink-soft dark:text-white/50 text-[.85rem]">
            @{currentUser.username} · age {currentUser.age} · joined{' '}
            {new Date(currentUser.joined).toLocaleDateString()}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 my-7">
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">{currentUser.xp}</b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">Total XP</span>
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">{totalCompleted}</b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">Lessons completed</span>
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">{currentUser.badges.length}</b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">Badges earned</span>
        </div>
      </div>

      <h3 className="mt-9">Badges</h3>
      <div className="flex gap-3.5 flex-wrap mt-2.5">
        {badges.map((b) => {
          const has = currentUser.badges.includes(b.id)
          return (
            <div
              key={b.id}
              title={b.desc}
              className={`bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl px-4 py-3.5 text-center w-[110px] ${!has ? 'opacity-35' : ''}`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="text-[.72rem] font-bold mt-1.5 text-ink-soft dark:text-white/60">{b.name}</div>
            </div>
          )
        })}
      </div>

      <h3 className="mt-9">Course progress</h3>
      {studyingCourses.length === 0 ? (
        <p className="text-ink-soft dark:text-white/50 text-[.9rem] mt-2.5">
          You haven't started any courses yet.{' '}
          <button className="text-violet font-bold hover:underline" onClick={() => navigate('/courses')}>
            Browse courses
          </button>{' '}
          to get going.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6 mt-4">
          {studyingCourses.map((c) => (
            <CourseCard key={c.id} course={c} currentUser={currentUser} showProgress />
          ))}
        </div>
      )}
    </div>
  )
}
