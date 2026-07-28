import { useParams, Navigate, Link } from "react-router-dom";
import { Flag } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { pathCourses, pathStats, progressPct } from "../lib/helpers";
import PathCourseNode from "../components/paths/PathCourseNode";

export default function PathDetailPage() {
  const { pathId } = useParams();
  const { paths, courses } = useContent();
  const { currentUser } = useAuth();

  const path = paths.find((p) => p.id === pathId);
  if (!path) return <Navigate to="/paths" replace />;

  const linked = pathCourses(path, courses);
  const { points, hours } = pathStats(path, courses);

  const stops = linked.map((course) => ({
    course,
    done: progressPct(currentUser, course) === 100,
  }));
  const allDone = stops.length > 0 && stops.every((s) => s.done);
  const firstLockedIndex = stops.findIndex((s, i) => i > 0 && !stops[i - 1].done);
  const visibleStops = firstLockedIndex === -1 ? stops : stops.slice(0, firstLockedIndex + 1);
  const showFinish = firstLockedIndex === -1;

  return (
    <div className="pt-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <Link to="/paths" className="hover:text-violet dark:hover:text-violet">
          Paths
        </Link>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">{path.label}</span>
      </nav>

      <h1 className="text-[2rem] mb-1">{path.label}</h1>
      <p className="text-ink-soft dark:text-white/60 font-mono text-[.85rem] mb-7">
        {path.level} · {linked.length} course{linked.length === 1 ? "" : "s"} · {points} pts · {hours}h
      </p>

      {linked.length === 0 ? (
        <p className="text-ink-soft dark:text-white/60">No courses have been added to this path yet.</p>
      ) : (
        <div className="relative ml-[22px] border-l-[3px] border-dashed border-line dark:border-white/15 pl-[38px]">
          {visibleStops.map((s, i) => (
            <PathCourseNode
              key={s.course.id}
              index={i}
              course={s.course}
              currentUser={currentUser}
              done={s.done}
              locked={i === firstLockedIndex}
            />
          ))}
          {showFinish && (
            <div className="relative h-[34px]">
              <div
                className={`absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full border-[3px] flex items-center justify-center text-base z-10 ${
                  allDone ? "bg-sun border-sun" : "bg-bg dark:bg-indigo-dark border-line dark:border-white/15"
                }`}
              >
                <Flag size={14} />
              </div>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-[.9rem] text-ink-soft dark:text-white/60">
                {allDone ? "Successfully completed!" : "Finish"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
