import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";

export default function LessonPracticeQuiz({ questions, onChecked }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.reduce(
    (acc, a, i) => acc + (a === questions[i].correct ? 1 : 0),
    0,
  );

  const selectAnswer = (qi, oi) => {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  };

  const check = () => {
    setSubmitted(true);
    onChecked?.(correctCount === questions.length);
  };

  const retry = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
  };

  return (
    <div className="mt-6 mb-6 pt-6 pb-6 border-t-2 border-b-2 border-dashed border-line dark:border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Brain size={13} /> practice quiz
          </span>
          <h3 className="text-[1.15rem] sm:text-[1.3rem]">
            Check your understanding
          </h3>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink-soft dark:text-white/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-4">
          {questions.map((q, qi) => (
            <div key={qi} className="mb-5">
              <p className="font-extrabold mb-3">
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
                    stateClasses = `bg-bg dark:bg-white/5 border-line dark:border-white/10 text-ink dark:text-white ${
                      !submitted ? "hover:bg-violet/10 hover:text-violet" : ""
                    }`;
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
                      "border-line dark:border-white/25 group-hover:border-violet";
                  } else {
                    bulletClasses = "border-line dark:border-white/25";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => selectAnswer(qi, oi)}
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
          <div className="flex justify-end">
            {submitted ? (
              <div className="flex items-center gap-3">
                <span className="font-bold">
                  Score: {correctCount}/{questions.length}
                </span>
                <button type="button" onClick={retry} className="btn btn-outline">
                  Try again
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={check}
                className="btn btn-primary"
              >
                Check
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
