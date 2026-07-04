import { useNavigate } from "react-router-dom";
import { progressPct } from "../../lib/helpers";

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
      className="bg-white rounded-2xl border-2 h-[250px] border-line overflow-hidden cursor-pointer transition-all hover:scale-[0.98] flex flex-col"
    >
      <div className="w-full h-2.5" style={{ background: course.color }} />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[1.5rem] font-bold mb-1.5">{course.title}</h3>
        <p className="text-ink-soft text-[.9rem] flex-1">{course.blurb}</p>
        <div className="flex justify-between items-center mt-4 font-mono text-[.72rem] text-ink-soft">
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
            <div className="h-2 bg-line rounded-md overflow-hidden mt-3">
              <div
                className="h-full bg-mint rounded-md"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[.68rem] text-ink-soft mt-1.5">
              {pct}% complete
            </div>
          </>
        )}
      </div>
    </div>
  );
}
