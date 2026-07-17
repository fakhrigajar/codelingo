import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { AdminButton } from "./AdminFields";
import CourseIcon from "../courses/CourseIcon";

export default function SortableCourseRow({ course, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 border-2 border-line dark:border-white/10 rounded-xl p-3 bg-bg dark:bg-white/5"
    >
      <div className="flex items-center gap-3 min-w-0 sm:flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-ink-soft dark:text-white/40 cursor-grab active:cursor-grabbing px-1 touch-none shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
        <span className="hidden sm:inline font-mono text-xs text-ink-soft dark:text-white/50 w-5 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <CourseIcon course={course} size={28} className="rounded-md shrink-0" />
        <span className="font-bold min-w-0 truncate flex-1">
          {course.title}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 sm:shrink-0">
        <span className="hidden sm:inline text-ink-soft dark:text-white/50 text-sm">
          {course.lessons.length} lessons
        </span>
        <AdminButton
          className="w-full"
          variant="danger"
          onClick={() => onRemove(course.id)}
        >
          Remove
        </AdminButton>
      </div>
    </div>
  );
}
