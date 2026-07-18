import { useNavigate } from "react-router-dom";
import { Award, Clock, ArrowRight } from "lucide-react";
import { pathCourses, pathStats } from "../../lib/helpers";

const VISIBLE_COURSES = 5;

export default function PathCard({ path, courses }) {
  const navigate = useNavigate();
  const linked = pathCourses(path, courses);
  const { courseCount, points, hours } = pathStats(path, courses);
  const visible = linked.slice(0, VISIBLE_COURSES);
  const remaining = linked.length - visible.length;

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-6 flex flex-col">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-violet/15 dark:bg-violet/20 flex items-center justify-center text-violet font-display font-extrabold text-lg">
          {path.label.trim()[0]?.toUpperCase() || "P"}
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[.7rem] font-bold uppercase tracking-wide text-ink-soft dark:text-white/50">
            Path · {path.level} · {courseCount} course
            {courseCount === 1 ? "" : "s"}
          </div>
          <h3 className="text-[1.15rem] leading-snug mt-0.5">{path.label}</h3>
        </div>
      </div>

      <div className="bg-bg dark:bg-white/[.03] border border-dashed border-line dark:border-white/10 rounded-xl p-3.5 mb-4 flex-1">
        {courseCount === 0 ? (
          <p className="text-ink-soft dark:text-white/50 text-[.85rem] m-0">
            No courses added to this path yet.
          </p>
        ) : (
          <>
            <ol className="space-y-2.5">
              {visible.map((course, i) => (
                <li
                  key={course.id}
                  className="flex items-center gap-2.5 min-w-0"
                >
                  <span className="font-mono text-[.75rem] text-ink-soft dark:text-white/40 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  -
                  <span className="text-[.9rem] font-bold truncate">
                    {course.title}
                  </span>
                </li>
              ))}
            </ol>
            {remaining > 0 && (
              <div className="text-[.8rem] text-ink-soft dark:text-white/50 mt-2.5 pl-[30px]">
                + {remaining} more course{remaining === 1 ? "" : "s"}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-dashed border-line dark:border-white/15 pt-4 mb-4 flex items-center gap-4 font-mono text-[.8rem] text-ink-soft dark:text-white/60">
        <span className="flex items-center gap-1.5">
          <Award size={14} /> {points} pts
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} /> {hours}h
        </span>
      </div>

      <button
        onClick={() => navigate(`/paths/${path.id}`)}
        className="btn btn-dark w-full inline-flex items-center justify-center gap-1.5"
      >
        Start path <ArrowRight size={16} />
      </button>
    </div>
  );
}
