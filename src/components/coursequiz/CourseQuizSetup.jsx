import { useState } from "react";
import { Brain } from "lucide-react";
import { generateCourseQuiz } from "../../lib/courseQuiz";

export default function CourseQuizSetup({ completedCourses, onReady }) {
  const [courseId, setCourseId] = useState(completedCourses[0].id);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  const handleStart = async () => {
    const course = completedCourses.find((c) => c.id === courseId);
    if (!course) return;
    setStatus("loading");
    setError("");
    try {
      const questions = await generateCourseQuiz({ courseId });
      onReady({ course, questions });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7 text-center">
      <div className="flex justify-center text-violet">
        <Brain size={32} />
      </div>
      <h2 className="text-[1.3rem] mt-2 mb-1.5">Which course should we quiz you on?</h2>
      <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-5">
        Pick a course you've finished — AI will generate fresh comprehension questions covering the
        whole thing.
      </p>

      <div className="flex flex-col gap-2 mb-5 text-left">
        {completedCourses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCourseId(c.id)}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold text-[.9rem] border-2 transition-colors ${
              courseId === c.id
                ? "border-violet bg-violet/10 text-violet dark:bg-violet/15"
                : "border-line dark:border-white/15 text-ink dark:text-white hover:border-violet/50"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: c.color }}
            />
            {c.title}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4 text-left">
          {error}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={handleStart}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating questions..." : "Start quiz"}
      </button>
    </div>
  );
}
