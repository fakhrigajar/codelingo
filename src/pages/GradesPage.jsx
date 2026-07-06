import { useState } from "react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { courseById, lessonById } from "../lib/helpers";
import FilterRow from "../components/common/FilterRow";
import RoadmapNode from "../components/grades/RoadmapNode";

export default function GradesPage() {
  const { grades, courses, pageText } = useContent();
  const { currentUser } = useAuth();
  const [activeGradeId, setActiveGradeId] = useState(grades[0]?.id);

  const grade = grades.find((g) => g.id === activeGradeId) || grades[0];

  const stops = grade
    ? grade.topics.map((topic) => {
        const course = courseById(courses, topic.source?.courseId);
        const lesson = lessonById(course, topic.source?.lessonId);
        const done = !!(
          currentUser &&
          course &&
          lesson &&
          (currentUser.completed[course.id] || []).includes(lesson.id)
        );
        return { topic, course, lesson, done };
      })
    : [];
  const allDone = stops.length > 0 && stops.every((s) => s.done);
  const firstLockedIndex = stops.findIndex(
    (s, i) => i > 0 && !stops[i - 1].done,
  );
  const visibleStops =
    firstLockedIndex === -1 ? stops : stops.slice(0, firstLockedIndex + 1);
  const showFinish = firstLockedIndex === -1;

  if (!grade) {
    return (
      <div className="pt-12">
        <h1 className="text-[2.2rem]">{pageText.gradesTitle}</h1>
        <p className="text-ink-soft dark:text-white/60">
          No grades have been added yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-12 pb-2.5">
        <h1 className="text-[2.2rem]">{pageText.gradesTitle}</h1>
        <p className="text-ink-soft dark:text-white/60 max-w-[600px]">
          {pageText.gradesSubtitle}
        </p>
        <FilterRow
          options={grades.map((g) => ({ value: g.id, label: g.label }))}
          active={activeGradeId}
          onChange={setActiveGradeId}
        />
      </div>
      <div className="mt-2.5">
        <p className="text-ink-soft dark:text-white/60 text-[.95rem] mb-7">
          {grade.age} · complete each stop to reveal the next
        </p>
        <div className="relative ml-[22px] border-l-[3px] border-dashed border-line dark:border-white/15 pl-[38px]">
          {visibleStops.map((s, i) => (
            <RoadmapNode
              key={i}
              index={i}
              topic={s.topic}
              course={s.course}
              lesson={s.lesson}
              done={s.done}
              locked={i === firstLockedIndex}
            />
          ))}
          {showFinish && (
            <div className="relative h-[34px]">
              <div
                className={`absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full border-[3px] flex items-center justify-center text-base z-10 ${
                  allDone
                    ? "bg-sun border-sun"
                    : "bg-bg dark:bg-indigo-dark border-line dark:border-white/15"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.03225 2H17.9677C18.464 2 18.8713 2.35862 18.9347 2.82785C19.3588 2.75105 19.7762 2.7715 20.1732 2.90777C20.9883 3.18759 21.5103 3.88408 21.7761 4.70688C22.2985 6.32363 21.9652 8.74646 20.6708 11.3354C20.4855 11.7058 20.035 11.856 19.6646 11.6708C19.2941 11.4855 19.1439 11.035 19.3291 10.6645C20.5347 8.25345 20.7015 6.25961 20.3488 5.16802C20.1771 4.63666 19.9179 4.40606 19.6861 4.3265C19.5055 4.2645 19.2209 4.25253 18.8155 4.42054C18.3656 8.66397 16.863 17 12 17C7.13695 17 5.63432 8.66397 5.18445 4.42054C4.77905 4.25253 4.49442 4.2645 4.3138 4.3265C4.08204 4.40606 3.82282 4.63666 3.65115 5.16802C3.29848 6.25961 3.46524 8.25345 4.67079 10.6645C4.85603 11.035 4.70586 11.4855 4.33538 11.6708C3.9649 11.856 3.51439 11.7058 3.32915 11.3354C2.0347 8.74646 1.70146 6.32363 2.22379 4.70688C2.48962 3.88408 3.01165 3.18759 3.82677 2.90777C4.22374 2.7715 4.64115 2.75105 5.06523 2.82784C5.12865 2.35862 5.53593 2 6.03225 2Z"
                    fill="#363538"
                  />
                  <path
                    d="M12 17.4185C11.7949 17.4185 11.5967 17.3976 11.4053 17.3574C10.8734 17.2456 10.2698 17.3682 9.98176 17.8291L8.95622 19.47C8.53994 20.136 9.01878 21 9.80422 21H14.1957C14.9812 21 15.46 20.136 15.0437 19.47L14.0182 17.8291C13.7301 17.3682 13.1265 17.2456 12.5946 17.3574C12.4032 17.3976 12.2051 17.4185 12 17.4185Z"
                    fill="#363538"
                  />
                </svg>
              </div>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-[.9rem] text-ink-soft dark:text-white/60">
                {allDone ? "Succesfully completed!" : "Finish"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
