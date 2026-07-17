import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { AdminButton } from "./AdminFields";
import LessonEditor from "./LessonEditor";

export default function SortableLessonItem({
  lesson,
  isOpen,
  onToggleEdit,
  onChange,
  onRemove,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
    data: { type: "lesson" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-line dark:border-white/10 rounded-xl bg-bg dark:bg-white/5 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3.5">
        <div className="flex w-full items-center gap-2.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing px-1 touch-none shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
          <span
            className="text-ink-soft dark:text-white/50 shrink-0"
            title={lesson.type === "quiz" ? "Quiz" : "Lesson"}
          >
            {lesson.type === "quiz" ? (
              <ClipboardList size={16} />
            ) : (
              <BookOpen size={16} />
            )}
          </span>
          <span className="font-bold truncate">{lesson.title}</span>
        </div>
        <AdminButton
          variant="outline"
          onClick={onToggleEdit}
          className="shrink-0 w-full sm:w-fit"
        >
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
      </div>

      {isOpen && (
        <div className="border-t-2 border-line dark:border-white/10 p-3.5">
          <LessonEditor
            lesson={lesson}
            onChange={onChange}
            onRemove={onRemove}
          />
        </div>
      )}
    </div>
  );
}
