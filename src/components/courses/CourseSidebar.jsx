import { useState } from "react";
import { completedCount, progressPct } from "../../lib/helpers";
import { getLessonMinutes } from "../../lib/lessonBlocks";
import { groupLessonsByUnit } from "../../lib/units";

const ABOUT_ID = "about";

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ItemIcon({ item, isDone }) {
  if (isDone) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5249 6.46434C19.8208 6.75426 19.8256 7.22911 19.5357 7.52495L11.1641 16.0674C10.0858 17.1676 8.31417 17.1676 7.23591 16.0674L4.46434 13.2392C4.17442 12.9434 4.17922 12.4685 4.47505 12.1786C4.77089 11.8887 5.24574 11.8935 5.53566 12.1893L8.30723 15.0175C8.79735 15.5176 9.60265 15.5176 10.0928 15.0175L18.4643 6.47505C18.7543 6.17922 19.2291 6.17442 19.5249 6.46434Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (item.type === "quiz") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 10.5h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5V11h-17V8.5z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6.5c-1.7-1.3-4-2-6.3-2-.7 0-1.2.5-1.2 1.2v10.6c0 .7.5 1.2 1.2 1.2 2 0 4.2.6 5.7 1.8.4.3.9.3 1.2 0 1.5-1.2 3.7-1.8 5.7-1.8.7 0 1.2-.5 1.2-1.2V5.7c0-.7-.5-1.2-1.2-1.2-2.3 0-4.6.7-6.3 2z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export default function CourseSidebar({
  course,
  currentUser,
  activeLessonId,
  onSelect,
}) {
  const doneIds = (currentUser && currentUser.completed[course.id]) || [];
  const pct = progressPct(currentUser, course);
  const done = completedCount(currentUser, course);
  const units = groupLessonsByUnit(course);
  const firstIncomplete =
    course.lessons.find((l) => !doneIds.includes(l.id)) || course.lessons[0];

  const [openUnits, setOpenUnits] = useState(() => {
    const initial = {};
    units.forEach((u) => {
      initial[u.number] = u.items.some((i) => i.id === firstIncomplete.id);
    });
    return initial;
  });

  const toggleUnit = (unit) => {
    setOpenUnits((prev) => ({ ...prev, [unit]: !prev[unit] }));
  };

  return (
    <div className="min-w-0 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-5 desktop:sticky desktop:top-24 h-fit">
      <div className="mb-4">
        <div className="font-bold truncate">{course.title}</div>
        <div className="font-mono text-[.68rem] text-ink-soft dark:text-white/50">
          {done}/{course.lessons.length} steps · {pct}%
        </div>
      </div>

      <div className="h-2 bg-line dark:bg-white/10 rounded-md overflow-hidden mb-4">
        <div
          className="h-full rounded-md transition-[width]"
          style={{ width: `${pct}%`, background: course.color }}
        />
      </div>

      <button
        type="button"
        onClick={() => onSelect(ABOUT_ID)}
        className={`w-full text-left px-3 py-2.5 border-solid border-2 border-line dark:border-white/10 rounded-lg font-bold text-[.88rem] mb-3 transition-colors ${
          activeLessonId === ABOUT_ID
            ? "bg-violet/15 text-violet border-transparent"
            : "text-ink-soft dark:text-white/60 hover:bg-bg dark:hover:bg-white/10"
        }`}
      >
        Overview
      </button>

      <div className="space-y-2">
        {units.map((u) => {
          const isOpen = !!openUnits[u.number];
          const unitMinutes = u.items.reduce(
            (a, i) => a + getLessonMinutes(i),
            0,
          );
          return (
            <div
              key={u.number ?? "unsorted"}
              className="border-2 border-line dark:border-white/10 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleUnit(u.number)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-3 text-left hover:bg-bg dark:hover:bg-white/5"
              >
                <div className="min-w-0">
                  {u.number != null ? (
                    <div className="font-bold text-[.9rem] truncate">
                      Unit {u.number}
                      {u.title ? `: ${u.title}` : ""}
                    </div>
                  ) : (
                    <div className="font-bold text-[.9rem] truncate">
                      {u.title}
                    </div>
                  )}
                  <div className="font-mono text-[.68rem] text-ink-soft dark:text-white/50 mt-0.5">
                    {u.items.length} lesson{u.items.length === 1 ? "" : "s"} ·{" "}
                    {unitMinutes}m
                  </div>
                </div>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <div className="border-t-2 border-line dark:border-white/10">
                  {u.items.map((item) => {
                    const isDone = doneIds.includes(item.id);
                    const isActive = activeLessonId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left border-t-2 first:border-t-0 border-line dark:border-white/10 transition-colors ${
                          isActive
                            ? "bg-violet/15"
                            : "hover:bg-bg dark:hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={
                            isActive
                              ? "text-violet"
                              : "text-ink-soft dark:text-white/50"
                          }
                        >
                          <ItemIcon item={item} isDone={isDone} />
                        </span>
                        <span
                          className={`flex-1 min-w-0 truncate text-[.82rem] font-bold ${
                            isActive ? "text-violet" : ""
                          }`}
                        >
                          {item.subUnit} {item.title}
                        </span>
                        {getLessonMinutes(item) > 0 && (
                          <span className="font-mono text-[.66rem] text-ink-soft dark:text-white/40 shrink-0">
                            {getLessonMinutes(item)}m
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
