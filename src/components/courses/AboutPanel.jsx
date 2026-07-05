export default function AboutPanel({ course }) {
  const lessonCount = course.lessons.filter((l) => l.type === "lesson").length;
  const quizCount = course.lessons.filter((l) => l.type === "quiz").length;

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 mt-6">
      <h1 className="text-[2rem] font-extrabold border-b-2 pb-5 border-line">
        About this course
      </h1>
      <h2 className="text-[2rem] font-bold">{course.title}</h2>
      <p className="text-[1.02rem] mb-3">{course.blurb}</p>
      <div className="flex flex-wrap gap-2.5 font-mono text-[.78rem] text-ink-soft dark:text-white/60 mb-2">
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
      </div>
    </div>
  );
}
