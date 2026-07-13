import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { AdminButton } from './AdminFields'
import CourseIcon from '../courses/CourseIcon'

export default function SortableCourseRow({ course, index, onRemove }) {
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
      className="flex items-center gap-3 border-2 border-line dark:border-white/10 rounded-xl p-3 bg-bg dark:bg-white/5"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing px-1 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>
      <span className="font-mono text-xs text-ink-soft dark:text-white/50 w-5 shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <CourseIcon course={course} size={28} className="rounded-md shrink-0" />
      <span className="font-bold flex-1 min-w-0 truncate">{course.title}</span>
      <span className="text-ink-soft dark:text-white/50 text-sm shrink-0">{course.lessons.length} lessons</span>
      <AdminButton variant="danger" onClick={() => onRemove(course.id)}>
        Remove
      </AdminButton>
    </div>
  )
}
