import { useNavigate } from "react-router-dom";
import { progressPct } from "../../lib/helpers";
import CourseCover from "./CourseCover";

export default function CourseCard({
  course,
  currentUser,
  showProgress = false,
  minWidth,
}) {
  const navigate = useNavigate();
  const pct = progressPct(currentUser, course);

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      style={minWidth ? { minWidth } : undefined}
      className="bg-white dark:bg-white/5 rounded-2xl border-2 h-[272px] border-line dark:border-white/10 overflow-hidden cursor-pointer transition-all hover:scale-[0.98] flex flex-col"
    >
      <CourseCover course={course} className="h-28 shrink-0" iconSize={52} />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[1.5rem] font-bold mb-1.5 flex-1">{course.title}</h3>
        <div className="flex justify-between items-center mt-4 font-mono text-[.72rem] text-ink-soft dark:text-white/60">
          <span
            className="px-2.5 py-1 rounded-md font-bold"
            style={{ background: `${course.color}33` }}
          >
            {course.level}
          </span>
          <span>{course.lessons.length} lessons</span>
        </div>
        {(showProgress || currentUser) && (
          <>
            <div className="h-2 bg-line dark:bg-white/10 rounded-md overflow-hidden mt-3">
              <div
                className="h-full bg-mint rounded-md"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[.68rem] text-ink-soft dark:text-white/60 mt-1.5">
              {pct}% complete
            </div>
          </>
        )}
      </div>
    </div>
  );
}
