import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

export default function SortableLessonBlock({ id, label, onRemove, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-line dark:border-white/10 rounded-lg p-3 mb-3 bg-bg dark:bg-white/5"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing touch-none shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <span className="font-mono text-[.65rem] font-bold uppercase tracking-wide text-ink-soft dark:text-white/50">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-ink-soft dark:text-white/40 hover:text-coral shrink-0"
          aria-label={`Delete ${label}`}
          title={`Delete ${label}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
      {children}
    </div>
  )
}
