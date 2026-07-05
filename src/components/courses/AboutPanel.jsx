import { Link } from "react-router-dom";
import { completedCount, progressPct } from "../../lib/helpers";

export default function AboutPanel({ course, currentUser, badges, onStart }) {
  const lessonCount = course.lessons.filter((l) => l.type === "lesson").length;
  const quizCount = course.lessons.filter((l) => l.type === "quiz").length;
  const doneIds = (currentUser && currentUser.completed[course.id]) || [];
  const pct = progressPct(currentUser, course);
  const done = completedCount(currentUser, course);
  const totalXp = course.lessons.reduce(
    (a, l) => a + (l.type === "quiz" ? 20 : 10),
    0,
  );
  const earnedXp = course.lessons.reduce(
    (a, l) => a + (doneIds.includes(l.id) ? (l.type === "quiz" ? 20 : 10) : 0),
    0,
  );
  const firstIncomplete =
    course.lessons.find((l) => !doneIds.includes(l.id)) || course.lessons[0];
  const championBadge = badges?.find((b) => b.id === "course-champion");
  const ctaLabel =
    pct === 0
      ? "Start course"
      : pct === 100
        ? "Review course"
        : "Continue course";

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 mt-6">
      <div className="flex items-center justify-between border-b-2 pb-2 border-line dark:border-white/10">
        <h1 className="text-[2rem] font-bold">About this course</h1>
        <Link to="/courses">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.78033 5.03033C8.07322 4.73744 8.07322 4.26256 7.78033 3.96967C7.48744 3.67678 7.01256 3.67678 6.71967 3.96967L3.72175 6.9676C3.5848 7.10348 3.5 7.29184 3.5 7.50001C3.5 7.69314 3.573 7.86922 3.69292 8.00217C3.70157 8.01176 3.71049 8.02116 3.71967 8.03034L6.71967 11.0303C7.01256 11.3232 7.48744 11.3232 7.78033 11.0303C8.07322 10.7374 8.07322 10.2626 7.78033 9.96967L6.06066 8.25H14.25C17.1495 8.25 19.5 10.6005 19.5 13.5C19.5 16.3995 17.1495 18.75 14.25 18.75H3.75C3.33579 18.75 3 19.0858 3 19.5C3 19.9142 3.33579 20.25 3.75 20.25H14.25C17.9779 20.25 21 17.2279 21 13.5C21 9.77208 17.9779 6.75 14.25 6.75H6.06067L7.78033 5.03033Z"
              className="fill-indigo-dark dark:fill-white/50"
            />
          </svg>
        </Link>
      </div>
      <h2 className="text-[2rem] font-bold mt-8">{course.title}</h2>
      <p className="text-[1.02rem] mb-3">{course.blurb}</p>
      <div className="flex flex-wrap gap-2.5 font-mono text-[.78rem] text-ink-soft dark:text-white/60 mb-5">
        <span
          className="px-2.5 py-1 rounded-md font-bold"
          style={{ background: `${course.color}33` }}
        >
          {course.level}
        </span>
        <span className="px-2.5 py-1 rounded-md font-bold bg-bg dark:bg-white/10">
          {lessonCount} lessons
        </span>
        {quizCount > 0 && (
          <span className="px-2.5 py-1 rounded-md font-bold bg-bg dark:bg-white/10">
            {quizCount} quiz{quizCount > 1 ? "zes" : ""}
          </span>
        )}
        <span className="px-2.5 py-1 rounded-md font-bold bg-bg dark:bg-white/10">
          {totalXp} XP total
        </span>
      </div>

      {currentUser ? (
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-1.5 font-mono text-[.78rem] text-ink-soft dark:text-white/60">
            <span>
              {done}/{course.lessons.length} steps · {earnedXp}/{totalXp} XP
            </span>
            <span className="font-bold text-ink dark:text-white">{pct}%</span>
          </div>
          <div className="h-2.5 bg-line dark:bg-white/10 rounded-md overflow-hidden">
            <div
              className="h-full rounded-md transition-[width]"
              style={{ width: `${pct}%`, background: course.color }}
            />
          </div>
        </div>
      ) : (
        <p className="text-[.82rem] text-ink-soft dark:text-white/50 mb-6">
          Log in to save your progress and earn XP.
        </p>
      )}

      <div className="mb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max px-1 py-2">
          {course.lessons.map((l, i) => {
            const isDone = doneIds.includes(l.id);
            return (
              <div key={l.id} className="flex items-center">
                {i > 0 && (
                  <div
                    className={`w-6 sm:w-9 h-0.5 flex-shrink-0 ${
                      isDone ? "" : "bg-line dark:bg-white/10"
                    }`}
                    style={isDone ? { background: course.color } : undefined}
                  />
                )}
                <div
                  title={l.title}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[.85rem] font-bold ${
                    isDone
                      ? "text-white border-transparent"
                      : "border-line dark:border-white/15 text-ink-soft dark:text-white/50"
                  }`}
                  style={isDone ? { background: course.color } : undefined}
                >
                  {isDone ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.5249 6.46434C19.8208 6.75426 19.8256 7.22911 19.5357 7.52495L11.1641 16.0674C10.0858 17.1676 8.31417 17.1676 7.23591 16.0674L4.46434 13.2392C4.17442 12.9434 4.17922 12.4685 4.47505 12.1786C4.77089 11.8887 5.24574 11.8935 5.53566 12.1893L8.30723 15.0175C8.79735 15.5176 9.60265 15.5176 10.0928 15.0175L18.4643 6.47505C18.7543 6.17922 19.2291 6.17442 19.5249 6.46434Z"
                        fill="white"
                      />
                    </svg>
                  ) : l.type === "quiz" ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9287 2.69642C12.3607 2.34078 11.6395 2.34078 11.0714 2.69642L3.01544 7.74017C1.8954 8.44141 1.9269 10.0835 3.07301 10.7412L11.129 15.3647C11.6685 15.6743 12.3317 15.6743 12.8712 15.3647L20.2501 11.1298V14.9997C20.2501 15.4139 20.5859 15.7497 21.0001 15.7497C21.4143 15.7497 21.7501 15.4139 21.7501 14.9997V9.66584C21.9298 8.96773 21.6776 8.17395 20.9847 7.74017L12.9287 2.69642Z"
                        className="fill-indigo-dark dark:fill-white/50"
                      />
                      <path
                        d="M5.87338 13.4838C5.64129 13.3506 5.3558 13.3511 5.12422 13.4852C4.89264 13.6193 4.75006 13.8667 4.75006 14.1343V18.3524C4.75006 19.6762 6.135 20.4874 7.28666 19.9988C8.64749 19.4214 10.5618 18.7499 12.0001 18.7499C13.4383 18.7499 15.3526 19.4214 16.7135 19.9988C17.8651 20.4874 19.2501 19.6762 19.2501 18.3524V14.1343C19.2501 13.8667 19.1075 13.6194 18.8759 13.4853C18.6443 13.3512 18.3588 13.3506 18.1267 13.4838L12.4979 16.7143C12.1896 16.8912 11.8106 16.8912 11.5023 16.7143L5.87338 13.4838Z"
                        className="fill-indigo-dark dark:fill-white/50"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          className="btn btn-primary"
          onClick={() => onStart?.(firstIncomplete.id)}
        >
          {ctaLabel} →
        </button>
        {championBadge && (
          <div className="flex items-center gap-2 font-mono text-[.78rem] text-ink-soft dark:text-white/60">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-base bg-bg dark:bg-white/10 ${
                pct === 100 ? "" : "opacity-50"
              }`}
            >
              {championBadge.icon}
            </span>
            Earn "{championBadge.name}" by finishing this course
          </div>
        )}
      </div>
    </div>
  );
}
