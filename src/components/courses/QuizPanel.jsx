import { useState } from "react";
import { Brain, Check } from "lucide-react";

export default function QuizPanel({ lesson, done, onComplete }) {
  const [answers, setAnswers] = useState(() =>
    new Array(lesson.questions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);

  if (done) {
    return (
      <>
        <span className="eyebrow inline-flex items-center gap-1.5">
          <Brain size={13} /> quiz
        </span>
        <h2 className="text-[1.4rem] sm:text-[1.6rem] desktop:text-[1.8rem]">{lesson.title}</h2>
        <p className="text-mint font-extrabold inline-flex items-center gap-1.5">
          <Check size={16} /> Quiz already completed — nice work!
        </p>
      </>
    );
  }

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.reduce(
    (acc, a, i) => acc + (a === lesson.questions[i].correct ? 1 : 0),
    0,
  );

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onComplete(lesson.points ?? 20, true), 900);
  };

  return (
    <>
      <span className="eyebrow inline-flex items-center gap-1.5">
        <Brain size={13} /> quiz
      </span>
      <h2 className="text-[1.4rem] sm:text-[1.6rem] desktop:text-[1.8rem]">{lesson.title}</h2>
      {lesson.questions.map((q, qi) => (
        <div key={qi} className="mb-5">
          <p className="font-extrabold mb-5">
            {qi + 1}. {q.q}
          </p>
          <div>
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              let stateClasses;
              if (submitted && oi === q.correct) {
                stateClasses =
                  "bg-[#E4FBF2] border-mint text-[#0B7A55] dark:bg-[#0B3B2E] dark:text-[#6EE7B7]";
              } else if (submitted && isSelected) {
                stateClasses =
                  "bg-[#FFEDEB] border-coral text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5]";
              } else if (!submitted && isSelected) {
                stateClasses = "bg-violet border-violet text-white";
              } else {
                stateClasses =
                  "bg-bg dark:bg-white/5 border-line dark:border-white/10 text-ink dark:text-white";
              }
              let bulletClasses;
              if (submitted && oi === q.correct) {
                bulletClasses = "border-mint";
              } else if (submitted && isSelected) {
                bulletClasses = "border-coral";
              } else if (!submitted && isSelected) {
                bulletClasses = "border-white bg-white";
              } else if (!submitted) {
                bulletClasses =
                  "border-line dark:border-white/25 group-hover:border-violet group-hover:bg-violet";
              } else {
                bulletClasses = "border-line dark:border-white/25";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => {
                    if (submitted) return;
                    setAnswers((prev) =>
                      prev.map((a, i) => (i === qi ? oi : a)),
                    );
                  }}
                  className={`group flex items-center gap-3 w-full text-left border-2 rounded-xl px-4 py-3.5 mb-2.5 font-bold disabled:cursor-default transition-colors ${stateClasses}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${bulletClasses}`}
                  >
                    {!submitted && (
                      <span
                        className={`w-2 h-2 rounded-full bg-violet transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        className="btn btn-primary"
        disabled={!allAnswered || submitted}
        onClick={handleSubmit}
      >
        {submitted
          ? `Score: ${correctCount}/${lesson.questions.length}`
          : allAnswered
            ? "Submit answers"
            : "Answer all questions to submit"}
      </button>
    </>
  );
}
