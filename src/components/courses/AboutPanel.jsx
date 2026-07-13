import { completedCount, progressPct } from "../../lib/helpers";
import { getBadgeIcon } from "../../lib/badgeIcons";
import { getLessonMinutes } from "../../lib/lessonBlocks";
import CourseCover from "./CourseCover";

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
  const totalMinutes = course.lessons.reduce(
    (a, l) => a + getLessonMinutes(l),
    0,
  );
  const earnedXp = course.lessons.reduce(
    (a, l) => a + (doneIds.includes(l.id) ? (l.type === "quiz" ? 20 : 10) : 0),
    0,
  );
  const firstIncomplete =
    course.lessons.find((l) => !doneIds.includes(l.id)) || course.lessons[0];
  const championBadge = badges?.find((b) => b.id === "course-champion");
  const ChampionIcon = championBadge && getBadgeIcon(championBadge.icon);
  const ctaLabel =
    pct === 0
      ? "Start course"
      : pct === 100
        ? "Review course"
        : "Continue course";

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
      <CourseCover
        course={course}
        className="h-40 sm:h-48 rounded-2xl"
        iconSize={84}
      />
      <h2 className="text-[2rem] font-bold mt-6">{course.title}</h2>
      <p className="text-[1.02rem] mb-3">{course.about}</p>
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
        {totalMinutes > 0 && (
          <span className="px-2.5 py-1 rounded-md font-bold bg-bg dark:bg-white/10">
            {totalMinutes} min total
          </span>
        )}
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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-violet bg-bg dark:bg-white/10 ${
                pct === 100 ? "" : "opacity-50"
              }`}
            >
              <ChampionIcon size={16} />
            </span>
            Earn "{championBadge.name}" by finishing this course
          </div>
        )}
      </div>
    </div>
  );
}
