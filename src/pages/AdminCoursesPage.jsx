import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import AdminCard from '../components/admin/AdminCard'
import { AdminButton } from '../components/admin/AdminFields'
import CourseEditor from '../components/admin/CourseEditor'

export default function AdminCoursesPage() {
  const { courses, setCourses } = useContent()
  const toast = useToast()
  const [openId, setOpenId] = useState(null)

  const updateCourse = (id, patch) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const removeCourse = (id) => {
    if (!confirm('Delete this course and all of its lessons? This cannot be undone.')) return
    setCourses(courses.filter((c) => c.id !== id))
    toast('Course deleted')
  }

  const addCourse = () => {
    const newCourse = {
      id: uid('course'),
      title: 'New Course',
      icon: '🆕',
      level: 'Beginner',
      color: '#8C7AE6',
      about: 'Describe this course.',
      lessons: [],
    }
    setCourses([...courses, newCourse])
    setOpenId(newCourse.id)
    toast('Course added')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h1 className="text-2xl m-0">Courses</h1>
        <AdminButton onClick={addCourse}>+ Add course</AdminButton>
      </div>
      <p className="text-ink-soft mb-6">
        Edit course info, lessons and quizzes. Changes save automatically and appear on the site right away.
      </p>

      <div className="space-y-4">
        {courses.map((course) => {
          const open = openId === course.id
          return (
            <AdminCard key={course.id}>
              <div
                className="flex justify-between items-center gap-3 flex-wrap cursor-pointer"
                onClick={() => setOpenId(open ? null : course.id)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{course.icon}</span>
                  <span className="font-extrabold">{course.title}</span>
                  <span className="text-ink-soft text-sm">
                    · {course.level} · {course.lessons.length} lessons
                  </span>
                </div>
                <span className="text-ink-soft">{open ? '▲' : '▼'}</span>
              </div>
              {open && (
                <div className="mt-4 pt-4 border-t border-line">
                  <CourseEditor
                    course={course}
                    onChange={(patch) => updateCourse(course.id, patch)}
                    onRemove={() => removeCourse(course.id)}
                  />
                </div>
              )}
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
