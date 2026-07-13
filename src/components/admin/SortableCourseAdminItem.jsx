import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { AdminButton } from './AdminFields'
import CourseIcon from '../courses/CourseIcon'
import CourseEditor from './CourseEditor'

export default function SortableCourseAdminItem({ course, draftCourse, isOpen, onToggleEdit, onPatch, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5"
    >
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing px-1 touch-none shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
          <CourseIcon course={course} size={32} className="rounded-lg shrink-0" />
          <span className="font-extrabold truncate">{course.title}</span>
          <span className="text-ink-soft dark:text-white/50 text-sm shrink-0">
            · {course.level} · {course.lessons.length} lessons
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <AdminButton variant="outline" onClick={onToggleEdit}>
            {isOpen ? (
              <span className="inline-flex items-center gap-1">
                Close <ChevronUp size={14} />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                Edit <ChevronDown size={14} />
              </span>
            )}
          </AdminButton>
          <AdminButton variant="danger" onClick={onRemove} aria-label="Delete course">
            <Trash2 size={14} />
          </AdminButton>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-line dark:border-white/10">
          <CourseEditor course={draftCourse} onChange={onPatch} />
        </div>
      )}
    </div>
  )
}
