import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { uid } from '../../lib/helpers'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton, AdminImageUpload } from './AdminFields'
import SortableLessonItem from './SortableLessonItem'
import CourseIcon from '../courses/CourseIcon'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function CourseEditor({ course, onChange, onRemove }) {
  const [openLessonId, setOpenLessonId] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const toggleLesson = (lessonId) => {
    setOpenLessonId((prev) => (prev === lessonId ? null : lessonId))
  }
  const updateLesson = (lessonId, patch) => {
    onChange({ lessons: course.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) })
  }
  const removeLesson = (lessonId) => {
    onChange({ lessons: course.lessons.filter((l) => l.id !== lessonId) })
    if (openLessonId === lessonId) setOpenLessonId(null)
  }
  const addLesson = () => {
    const id = uid('l')
    onChange({
      lessons: [
        ...course.lessons,
        { id, type: 'lesson', title: 'New lesson', body: '', fact: '' },
      ],
    })
    setOpenLessonId(id)
  }
  const addQuiz = () => {
    const id = uid('q')
    onChange({
      lessons: [
        ...course.lessons,
        { id, type: 'quiz', title: 'New quiz', questions: [{ q: 'New question?', options: ['Option A', 'Option B'], correct: 0 }] },
      ],
    })
    setOpenLessonId(id)
  }
  const handleLessonDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = course.lessons.findIndex((l) => l.id === active.id)
    const newIndex = course.lessons.findIndex((l) => l.id === over.id)
    onChange({ lessons: arrayMove(course.lessons, oldIndex, newIndex) })
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3">
        <AdminInput
          label="Title"
          placeholder="e.g. Python Fundamentals"
          value={course.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <AdminSelect label="Level" value={course.level} onChange={(e) => onChange({ level: e.target.value })}>
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </AdminSelect>
      </div>
      <div className="grid sm:grid-cols-[auto_1fr] gap-3 items-end">
        <AdminImageUpload
          label="Icon"
          value={course.icon}
          onChange={(icon) => onChange({ icon })}
          preview={<CourseIcon course={course} size={48} className="rounded-xl shrink-0" />}
        />
        <AdminInput
          label="Accent color"
          type="color"
          value={course.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="h-[42px] p-1"
        />
      </div>
      <AdminTextarea
        label="About"
        placeholder="What will learners get out of this course?"
        value={course.about}
        onChange={(e) => onChange({ about: e.target.value })}
      />

      <div className="mt-3">
        <span className="block font-bold text-[.85rem] mb-0.5 text-ink-soft dark:text-white/60">
          Lessons &amp; quizzes ({course.lessons.length})
        </span>
        <p className="text-[.78rem] text-ink-soft/70 dark:text-white/40 mb-2">
          Drag to reorder. Click Edit to change a lesson's content.
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
          <SortableContext items={course.lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {course.lessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isOpen={openLessonId === lesson.id}
                  onToggleEdit={() => toggleLesson(lesson.id)}
                  onChange={(patch) => updateLesson(lesson.id, patch)}
                  onRemove={() => removeLesson(lesson.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex gap-2 mt-3">
          <AdminButton variant="outline" onClick={addLesson}>
            + Add lesson
          </AdminButton>
          <AdminButton variant="outline" onClick={addQuiz}>
            + Add quiz
          </AdminButton>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line dark:border-white/10">
        <AdminButton variant="danger" onClick={onRemove}>
          Delete this course
        </AdminButton>
      </div>
    </div>
  )
}
