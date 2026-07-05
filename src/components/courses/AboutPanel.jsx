import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { completedCount, progressPct } from "../../lib/helpers";

const SIZES = {
  mobile: { node: 40, row: 66, topPad: 40, offset: 34, icon: 16, iconLast: 18 },
  desktop: { node: 64, row: 100, topPad: 60, offset: 60, icon: 24, iconLast: 26 },
};
const LABEL_WIDTH = 150;
const LABEL_GAP = 16;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  const R = clamp((num >> 16) + amt);
  const G = clamp(((num >> 8) & 0x00ff) + amt);
  const B = clamp((num & 0x0000ff) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

export default function AboutPanel({ course, currentUser, badges, onStart }) {
  const isMobile = useIsMobile();
  const sz = isMobile ? SIZES.mobile : SIZES.desktop;
  const NODE_SIZE = sz.node;
  const ROW_HEIGHT = sz.row;
  const TOP_PAD = sz.topPad;
  const ICON_SIZE = sz.icon;
  const ICON_SIZE_LAST = sz.iconLast;
  const OFFSETS = [0, sz.offset, 0, -sz.offset];
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

      <div className="mb-8">
        <div
          className="relative mx-auto"
          style={{
            width:
              NODE_SIZE +
              Math.max(...OFFSETS.map(Math.abs)) * 2 +
              40 +
              (isMobile ? 0 : (LABEL_GAP + LABEL_WIDTH) * 2),
            height:
              (course.lessons.length - 1) * ROW_HEIGHT +
              NODE_SIZE +
              TOP_PAD +
              8,
          }}
        >
          {course.lessons.map((l, i) => {
            const isDone = doneIds.includes(l.id);
            const isLast = i === course.lessons.length - 1;
            const isCurrent = !isDone && l.id === firstIncomplete.id;
            const isActive = isDone || isCurrent;
            const isLocked =
              !isDone && i > 0 && !doneIds.includes(course.lessons[i - 1].id);
            const offsetX = OFFSETS[i % OFFSETS.length];
            const cy = i * ROW_HEIGHT + NODE_SIZE / 2 + TOP_PAD;
            const labelOnRight = offsetX >= 0;

            let connector = null;
            if (!isLast) {
              const nextOffsetX = OFFSETS[(i + 1) % OFFSETS.length];
              const dx = nextOffsetX - offsetX;
              const dy = ROW_HEIGHT;
              const length = Math.hypot(dx, dy);
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
              connector = (
                <div
                  className={`absolute rounded-full ${
                    isDone ? "" : "bg-line dark:bg-white/10"
                  }`}
                  style={{
                    left: `calc(50% + ${offsetX}px)`,
                    top: cy,
                    width: length,
                    height: isMobile ? 4 : 6,
                    background: isDone ? course.color : undefined,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "0 50%",
                  }}
                />
              );
            }

            return (
              <Fragment key={l.id}>
                {connector}

                {isCurrent && (
                  <div
                    className={`absolute z-20 whitespace-nowrap rounded-xl font-mono font-bold text-white shadow-md ${
                      isMobile ? "px-2.5 py-1 text-[.6rem]" : "px-4 py-1.5 text-[.72rem]"
                    }`}
                    style={{
                      left: `calc(50% + ${offsetX}px)`,
                      top: cy - NODE_SIZE / 2 - (isMobile ? 30 : 42),
                      transform: "translateX(-50%)",
                      background: course.color,
                    }}
                  >
                    START
                    <div
                      className="absolute left-1/2 -bottom-1.5 w-3 h-3 -translate-x-1/2 rotate-45"
                      style={{ background: course.color }}
                    />
                  </div>
                )}

                {!isMobile && (
                  <div
                    className={`absolute z-10 leading-tight ${
                      isLocked
                        ? "text-ink-soft/50 dark:text-white/25"
                        : "text-ink dark:text-white/90"
                    }`}
                    style={{
                      top: cy,
                      transform: "translateY(-50%)",
                      width: LABEL_WIDTH,
                      textAlign: labelOnRight ? "left" : "right",
                      ...(labelOnRight
                        ? {
                            left: `calc(50% + ${offsetX + NODE_SIZE / 2 + LABEL_GAP}px)`,
                          }
                        : {
                            right: `calc(50% + ${NODE_SIZE / 2 + LABEL_GAP - offsetX}px)`,
                          }),
                    }}
                  >
                    <div
                      className="font-mono text-[.68rem] font-bold uppercase tracking-wide"
                      style={{ color: isActive ? course.color : undefined }}
                    >
                      Unit {i + 1}
                    </div>
                    <div className="text-[.82rem] font-bold line-clamp-2">
                      {l.title}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  title={l.title}
                  disabled={isLocked}
                  onClick={() => !isLocked && onStart?.(l.id)}
                  className={`absolute z-10 rounded-full flex items-center justify-center transition-transform ${
                    isLocked ? "cursor-not-allowed" : "hover:scale-105"
                  } ${
                    isActive
                      ? "text-white"
                      : "bg-white dark:bg-white/5 border-2 border-line dark:border-white/15 text-ink-soft dark:text-white/40"
                  } ${isCurrent ? "animate-pulse" : ""}`}
                  style={{
                    left: `calc(50% + ${offsetX}px)`,
                    top: cy,
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                    transform: "translate(-50%, -50%)",
                    background: isActive ? course.color : undefined,
                    boxShadow: isActive
                      ? `0 ${isMobile ? 3 : 5}px 0 ${shadeColor(course.color, -25)}`
                      : `0 ${isMobile ? 2 : 3}px 0 rgba(0,0,0,0.06)`,
                  }}
                >
                  {isDone ? (
                    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.5249 6.46434C19.8208 6.75426 19.8256 7.22911 19.5357 7.52495L11.1641 16.0674C10.0858 17.1676 8.31417 17.1676 7.23591 16.0674L4.46434 13.2392C4.17442 12.9434 4.17922 12.4685 4.47505 12.1786C4.77089 11.8887 5.24574 11.8935 5.53566 12.1893L8.30723 15.0175C8.79735 15.5176 9.60265 15.5176 10.0928 15.0175L18.4643 6.47505C18.7543 6.17922 19.2291 6.17442 19.5249 6.46434Z"
                        fill="white"
                      />
                    </svg>
                  ) : isLocked ? (
                    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
                      <rect
                        x="5"
                        y="11"
                        width="14"
                        height="9"
                        rx="2.5"
                        fill="currentColor"
                        opacity="0.5"
                      />
                      <path
                        d="M8 11V8a4 4 0 0 1 8 0v3"
                        stroke="currentColor"
                        strokeOpacity="0.5"
                        strokeWidth="1.8"
                        fill="none"
                      />
                    </svg>
                  ) : isLast ? (
                    <svg width={ICON_SIZE_LAST} height={ICON_SIZE_LAST} viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 4h10v3.2c0 2.9-1.8 5.4-4.4 6.3l-.1 2.5h2.3a1 1 0 0 1 0 2H9.2a1 1 0 0 1 0-2h2.3l-.1-2.5C8.8 12.6 7 10.1 7 7.2V4z"
                        fill={isActive ? "white" : "currentColor"}
                        opacity={isActive ? 1 : 0.5}
                      />
                      <path
                        d="M5 5H3.5a1.5 1.5 0 0 0-1.5 1.5v1A3.5 3.5 0 0 0 5.5 11"
                        stroke={isActive ? "white" : "currentColor"}
                        strokeOpacity={isActive ? 1 : 0.5}
                        strokeWidth="1.6"
                        fill="none"
                      />
                      <path
                        d="M19 5h1.5A1.5 1.5 0 0 1 22 6.5v1A3.5 3.5 0 0 1 18.5 11"
                        stroke={isActive ? "white" : "currentColor"}
                        strokeOpacity={isActive ? 1 : 0.5}
                        strokeWidth="1.6"
                        fill="none"
                      />
                      <rect
                        x="8"
                        y="18"
                        width="8"
                        height="2.4"
                        rx="1.2"
                        fill={isActive ? "white" : "currentColor"}
                        opacity={isActive ? 1 : 0.5}
                      />
                    </svg>
                  ) : l.type === "quiz" ? (
                    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 10.5h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z"
                        fill={isActive ? "white" : "currentColor"}
                        opacity={isActive ? 1 : 0.5}
                      />
                      <path
                        d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5V11h-17V8.5z"
                        fill={isActive ? "white" : "currentColor"}
                      />
                      <circle
                        cx="12"
                        cy="9.2"
                        r="1.3"
                        fill={isActive ? undefined : "currentColor"}
                        className={isActive ? "opacity-70" : ""}
                        style={
                          isActive
                            ? { fill: shadeColor(course.color, -25) }
                            : undefined
                        }
                      />
                      <rect
                        x="10.7"
                        y="10.3"
                        width="2.6"
                        height="2.6"
                        rx="0.5"
                        fill={
                          isActive
                            ? shadeColor(course.color, -25)
                            : "currentColor"
                        }
                        opacity={isActive ? 0.7 : 1}
                      />
                    </svg>
                  ) : (
                    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 6.5c-1.7-1.3-4-2-6.3-2-.7 0-1.2.5-1.2 1.2v10.6c0 .7.5 1.2 1.2 1.2 2 0 4.2.6 5.7 1.8.4.3.9.3 1.2 0 1.5-1.2 3.7-1.8 5.7-1.8.7 0 1.2-.5 1.2-1.2V5.7c0-.7-.5-1.2-1.2-1.2-2.3 0-4.6.7-6.3 2z"
                        fill={isActive ? "white" : "currentColor"}
                        opacity={isActive ? 1 : 0.5}
                      />
                      <path
                        d="M12 6.5v11.8"
                        stroke={
                          isActive
                            ? shadeColor(course.color, -25)
                            : "currentColor"
                        }
                        strokeOpacity={isActive ? 0.6 : 0.3}
                        strokeWidth="1.4"
                      />
                    </svg>
                  )}
                </button>
              </Fragment>
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
