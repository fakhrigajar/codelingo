import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { unitContainerId } from '../../lib/units'
import { AdminButton } from './AdminFields'
import SortableLessonItem from './SortableLessonItem'

export default function SortableUnitBlock({
  group,
  openLessonId,
  onToggleLesson,
  onLessonChange,
  onLessonRemove,
  onRemoveUnit,
  onRenameUnit,
  onAddLesson,
  onAddQuiz,
}) {
  const isRealUnit = group.number != null

  const sortable = useSortable({
    id: isRealUnit ? `unit-${group.number}` : `unsorted-unit`,
    data: { type: 'unit' },
    disabled: !isRealUnit,
  })
  // Distinct type from the unit's own sortable ('unit') above — this is the
  // droppable lessons can land on, not the whole-unit-block drag target, and
  // the two need to be tellable apart when filtering collisions per drag kind.
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: unitContainerId(group.number),
    data: { type: 'unit-container', number: group.number },
  })

  const style = isRealUnit
    ? {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        opacity: sortable.isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={isRealUnit ? sortable.setNodeRef : undefined}
      style={style}
      className="border-2 border-line dark:border-white/15 rounded-2xl p-3.5 bg-white dark:bg-white/[0.03]"
    >
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isRealUnit && (
            <button
              type="button"
              {...sortable.attributes}
              {...sortable.listeners}
              className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing px-1 touch-none shrink-0"
              aria-label="Drag to reorder unit"
            >
              <GripVertical size={18} />
            </button>
          )}
          {isRealUnit ? (
            <>
              <span className="font-bold text-[.95rem] shrink-0">Unit {group.number}</span>
              {onRenameUnit && (
                <input
                  type="text"
                  value={group.title || ''}
                  onChange={(e) => onRenameUnit(e.target.value)}
                  placeholder="Unit title (optional)"
                  className="flex-1 min-w-0 bg-transparent border-b-2 border-dashed border-line dark:border-white/20 text-[.85rem] font-semibold px-1 py-0.5 focus:outline-none focus:border-violet"
                />
              )}
            </>
          ) : (
            <span className="font-bold text-[.95rem] truncate">Unsorted</span>
          )}
        </div>
        {onRemoveUnit && (
          <button
            type="button"
            onClick={onRemoveUnit}
            className="text-ink-soft dark:text-white/40 hover:text-coral shrink-0"
            aria-label="Delete unit"
            title="Delete empty unit"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div
        ref={setDropRef}
        className={`rounded-xl transition-colors ${isOver ? 'bg-violet/10' : ''} ${group.items.length ? '' : 'border-2 border-dashed border-line dark:border-white/15 py-6 flex items-center justify-center'}`}
      >
        {group.items.length === 0 ? (
          <span className="text-[.8rem] text-ink-soft/70 dark:text-white/40">Drag a lesson here</span>
        ) : (
          <SortableContext items={group.items.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {group.items.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isOpen={openLessonId === lesson.id}
                  onToggleEdit={() => onToggleLesson(lesson.id)}
                  onChange={(patch) => onLessonChange(lesson.id, patch)}
                  onRemove={() => onLessonRemove(lesson.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {(onAddLesson || onAddQuiz) && (
        <div className="flex gap-2 mt-3">
          {onAddLesson && (
            <AdminButton variant="outline" onClick={onAddLesson}>
              + Add lesson
            </AdminButton>
          )}
          {onAddQuiz && (
            <AdminButton variant="outline" onClick={onAddQuiz}>
              + Add quiz
            </AdminButton>
          )}
        </div>
      )}
    </div>
  )
}
