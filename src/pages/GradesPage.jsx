import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useAuth } from '../context/AuthContext'
import { courseById, lessonById } from '../lib/helpers'
import FilterRow from '../components/common/FilterRow'
import RoadmapNode from '../components/grades/RoadmapNode'

export default function GradesPage() {
  const { grades, courses, pageText } = useContent()
  const { currentUser } = useAuth()
  const [activeGradeId, setActiveGradeId] = useState(grades[0]?.id)

  const grade = grades.find((g) => g.id === activeGradeId) || grades[0]

  if (!grade) {
    return (
      <div className="pt-12">
        <h1 className="text-[2.2rem]">{pageText.gradesTitle}</h1>
        <p className="text-ink-soft">No grades have been added yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="pt-1.5">
        <h1 className="text-[2.2rem]">{pageText.gradesTitle}</h1>
        <p className="text-ink-soft max-w-[600px]">{pageText.gradesSubtitle}</p>
        <FilterRow
          options={grades.map((g) => ({ value: g.id, label: g.label }))}
          active={activeGradeId}
          onChange={setActiveGradeId}
        />
      </div>
      <div className="mt-2.5">
        <p className="text-ink-soft text-[.95rem] mb-7">
          Ages {grade.age} · {grade.topics.length} stops on this roadmap
        </p>
        <div className="relative ml-[22px] border-l-[3px] border-dashed border-line pl-[38px]">
          {grade.topics.map((topic, i) => {
            const course = courseById(courses, topic.source?.courseId)
            const lesson = lessonById(course, topic.source?.lessonId)
            const done = !!(currentUser && course && lesson && (currentUser.completed[course.id] || []).includes(lesson.id))
            return (
              <RoadmapNode key={i} index={i} topic={topic} course={course} lesson={lesson} done={done} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
