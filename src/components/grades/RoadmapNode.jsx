import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoadmapNode({
  index,
  topic,
  course,
  lesson,
  done,
  locked,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (locked) {
    return (
      <div className="relative h-[34px]">
        <div className="absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full bg-bg dark:bg-indigo-dark border-[3px] border-line dark:border-white/15 flex items-center justify-center text-sm z-10">
          <span className="opacity-70">🔒</span>
        </div>
        <div className="absolute left-0 top-0 w-full rounded-2xl border-2 border-line dark:border-white/10 overflow-hidden">
          <div
            className="bg-white dark:bg-white/5 px-5 py-[18px] blur-[6px] select-none pointer-events-none"
            aria-hidden="true"
          >
            <div className="flex justify-between items-center gap-3 flex-wrap">
              <h4 className="m-0 text-[1.05rem]">{topic.title}</h4>
              <span className="font-mono text-xs text-ink-soft dark:text-white/60 whitespace-nowrap">
                {course?.icon} {course?.title}
              </span>
            </div>
            <p className="mt-2 mb-0 text-ink-soft dark:text-white/60 text-[.9rem]">
              {topic.desc}
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-indigo-dark/70">
            <span className="font-bold flex items-center gap-1 text-[.85rem] text-ink-soft dark:text-white/70 text-center px-5">
              <span>
                <svg
                  className="-mt-1"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.25 8V6C7.25 3.37665 9.37665 1.25 12 1.25C14.6234 1.25 16.75 3.37665 16.75 6V8H17C19.2091 8 21 9.79086 21 12V18C21 20.2091 19.2091 22 17 22H7C4.79086 22 3 20.2091 3 18V12C3 9.79086 4.79086 8 7 8H7.25ZM8.75 6C8.75 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6V8H8.75V6Z"
                    fill="#4A5578"
                  />
                </svg>
              </span>
              Finish the previous level to unlock
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="relative mb-5">
        <div className="absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full bg-bg dark:bg-indigo-dark border-[3px] border-line dark:border-white/15 flex items-center justify-center font-mono font-bold text-[.85rem] text-ink-soft dark:text-white/60 z-10">
          {index + 1}
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl px-5 py-[18px]">
          <h4 className="m-0 text-[1.05rem]">{topic.title}</h4>
          <p className="mt-2 mb-0 text-ink-soft dark:text-white/60 text-[.9rem]">
            {topic.desc}
          </p>
          <p className="mt-2 mb-0 text-coral text-[.8rem] font-bold">
            Linked lesson not found — check this topic in Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-5">
      <div
        className={`absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full border-[3px] flex items-center justify-center font-mono font-bold text-[.85rem] z-10 ${
          done
            ? "bg-mint border-mint text-white"
            : "bg-bg dark:bg-indigo-dark border-line dark:border-white/15 text-ink-soft dark:text-white/60"
        }`}
      >
        {done ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.5249 6.46434C19.8208 6.75426 19.8256 7.22911 19.5357 7.52495L11.1641 16.0674C10.0858 17.1676 8.31417 17.1676 7.23591 16.0674L4.46434 13.2392C4.17442 12.9434 4.17922 12.4685 4.47505 12.1786C4.77089 11.8887 5.24574 11.8935 5.53566 12.1893L8.30723 15.0175C8.79735 15.5176 9.60265 15.5176 10.0928 15.0175L18.4643 6.47505C18.7543 6.17922 19.2291 6.17442 19.5249 6.46434Z"
              fill="white"
            />
          </svg>
        ) : (
          index + 1
        )}
      </div>
      <div
        onClick={() => setOpen((o) => !o)}
        className={`bg-white dark:bg-white/5 border-2 rounded-2xl px-5 py-[18px] cursor-pointer transition-colors hover:border-violet ${
          open ? "border-violet" : "border-line dark:border-white/10"
        }`}
      >
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <h4 className="m-0 text-[1.05rem]">{topic.title}</h4>
          <span className="font-mono text-xs text-ink-soft dark:text-white/60 whitespace-nowrap">
            {course.icon} {course.title}
          </span>
        </div>
        <p className="mt-2 mb-0 text-ink-soft dark:text-white/60 text-[.9rem]">
          {topic.desc}
        </p>
      </div>
      {open && (
        <div className="mt-2.5 bg-bg dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl px-[18px] py-4">
          <div className="font-mono text-xs text-violet font-bold tracking-wide mb-2">
            SOURCE
          </div>
          <p className="mb-3.5">
            {course.icon} <strong>{course.title}</strong> → {lesson.title}{" "}
            <span className="font-mono text-[.72rem] text-ink-soft dark:text-white/60">
              ({lesson.type === "quiz" ? "quiz" : "lesson"})
            </span>
          </p>
          <button
            className="btn btn-dark btn-sm"
            onClick={() =>
              navigate(`/courses/${course.id}?lesson=${lesson.id}`)
            }
          >
            Open this lesson →
          </button>
        </div>
      )}
    </div>
  );
}
