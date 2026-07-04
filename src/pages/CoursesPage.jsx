import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useAuth } from '../context/AuthContext'
import CourseCard from '../components/courses/CourseCard'
import FilterRow from '../components/common/FilterRow'

const LEVELS = ['all', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const { courses } = useContent()
  const { currentUser } = useAuth()
  const [filter, setFilter] = useState('all')

  const list = courses.filter((c) => filter === 'all' || c.level === filter)

  return (
    <div>
      <div className="pt-12 pb-2.5">
        <h1 className="text-[2.2rem]">Course library</h1>
        <p className="text-ink-soft max-w-[600px]">
          Six modules covering the ICT basics every kid should know. Tap a card to open it.
        </p>
        <FilterRow
          options={LEVELS.map((l) => ({ value: l, label: l === 'all' ? 'All courses' : l }))}
          active={filter}
          onChange={setFilter}
        />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} currentUser={currentUser} />
        ))}
      </div>
    </div>
  )
}
