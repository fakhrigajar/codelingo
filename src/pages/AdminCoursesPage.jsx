import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import { AdminButton } from '../components/admin/AdminFields'
import SortableCourseAdminItem from '../components/admin/SortableCourseAdminItem'

export default function AdminCoursesPage() {
  const { courses, addCourse, updateCourse, removeCourse, reorderCourses } = useContent()
  const toast = useToast()
  const [openId, setOpenId] = useState(null)
  const [drafts, setDrafts] = useState({})
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleRemove = (id) => {
    if (!confirm('Delete this course and all of its lessons? This cannot be undone.')) return
    removeCourse(id)
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (openId === id) setOpenId(null)
    toast('Course deleted')
  }

  const handleAdd = () => {
    const newCourse = {
      id: uid('course'),
      title: 'New Course',
      icon: '',
      level: 'Beginner',
      color: '#8C7AE6',
      about: 'Describe this course.',
      lessons: [],
    }
    addCourse(newCourse)
    setOpenId(newCourse.id)
    toast('Course added')
  }

  const toggleEdit = (id) => {
    if (openId === id) {
      setOpenId(null)
      return
    }
    setDrafts((prev) => (prev[id] ? prev : { ...prev, [id]: courses.find((c) => c.id === id) }))
    setOpenId(id)
  }

  const patchDraft = (id, patch) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = courses.findIndex((c) => c.id === active.id)
    const newIndex = courses.findIndex((c) => c.id === over.id)
    reorderCourses(arrayMove(courses, oldIndex, newIndex))
  }

  const handleSubmit = () => {
    const pending = Object.entries(drafts)
    pending.forEach(([id, draft]) => updateCourse(id, draft))
    setDrafts({})
    setOpenId(null)
    toast(pending.length ? 'Changes saved' : 'Nothing to save')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h1 className="text-2xl m-0">Courses</h1>
        <AdminButton onClick={handleAdd}>+ Add course</AdminButton>
      </div>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        Drag to reorder. Click Edit to change a course's info, lessons and quizzes — edits are staged until you save.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={courses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {courses.map((course) => (
              <SortableCourseAdminItem
                key={course.id}
                course={course}
                draftCourse={drafts[course.id] ?? course}
                isOpen={openId === course.id}
                onToggleEdit={() => toggleEdit(course.id)}
                onPatch={(patch) => patchDraft(course.id, patch)}
                onRemove={() => handleRemove(course.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end mt-6">
        <AdminButton onClick={handleSubmit}>Save changes</AdminButton>
      </div>
    </div>
  )
}
