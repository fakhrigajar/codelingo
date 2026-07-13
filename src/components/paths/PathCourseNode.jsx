import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { progressPct } from "../../lib/helpers";
import CourseIcon from "../courses/CourseIcon";

export default function PathCourseNode({ index, course, currentUser, done, locked }) {
  const navigate = useNavigate();
  const pct = progressPct(currentUser, course);

  if (locked) {
    return (
      <div className="relative h-[34px]">
        <div className="absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full bg-bg dark:bg-indigo-dark border-[3px] border-line dark:border-white/15 flex items-center justify-center text-sm z-10">
          <Lock size={14} className="opacity-70" />
        </div>
        <div className="absolute left-0 top-0 w-full rounded-2xl border-2 border-line dark:border-white/10 overflow-hidden">
          <div
            className="bg-white dark:bg-white/5 px-5 py-[18px] flex items-center gap-3.5 blur-[6px] select-none pointer-events-none"
            aria-hidden="true"
          >
            <CourseIcon course={course} size={40} className="rounded-lg shrink-0" />
            <div>
              <h4 className="m-0 text-[1.05rem]">{course.title}</h4>
              <p className="mt-1 mb-0 text-ink-soft dark:text-white/60 text-[.85rem]">
                {course.lessons.length} lessons
              </p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-indigo-dark/70">
            <span className="font-bold text-[.85rem] text-ink-soft dark:text-white/70 text-center px-5">
              Finish the previous course to unlock
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-5">
      <div
        className={`absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full border-[3px] flex items-center justify-center font-mono font-bold text-[.85rem] z-10 ${
          done
            ? "bg-mint border-mint text-white"
            : "bg-bg dark:bg-indigo-dark border-line dark:border-white/15 text-ink-soft dark:text-white/60"
        }`}
      >
        {done ? <Check size={18} /> : index + 1}
      </div>
      <div
        onClick={() => navigate(`/courses/${course.id}`)}
        className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl px-5 py-[18px] cursor-pointer transition-colors hover:border-violet flex items-center gap-3.5"
      >
        <CourseIcon course={course} size={40} className="rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <h4 className="m-0 text-[1.05rem]">{course.title}</h4>
            <span className="font-mono text-xs text-ink-soft dark:text-white/60 whitespace-nowrap">
              {course.lessons.length} lessons
            </span>
          </div>
          {currentUser && (
            <div className="h-1.5 bg-line dark:bg-white/10 rounded-md overflow-hidden mt-2.5">
              <div className="h-full bg-mint rounded-md" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
