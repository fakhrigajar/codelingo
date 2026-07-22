import { useState } from "react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { completedCount } from "../lib/helpers";
import CourseCard from "../components/courses/CourseCard";
import FilterRow from "../components/common/FilterRow";
import FadeIn from "../components/common/FadeIn";

const LEVELS = ["all", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { courses, pageText } = useContent();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const availableCourses = courses.filter(
    (c) => c.availability !== "coming-soon",
  );

  const q = query.trim().toLowerCase();
  const list = availableCourses.filter(
    (c) =>
      (filter === "all" || c.level === filter) &&
      (!q ||
        c.title.toLowerCase().includes(q) ||
        c.about.toLowerCase().includes(q)),
  );

  const inProgressCount = availableCourses.filter((c) => {
    const done = completedCount(currentUser, c);
    return done > 0 && done < c.lessons.length;
  }).length;

  return (
    <div>
      <div className="pt-12 pb-2.5">
        <FadeIn
          delay={0.05}
          className="flex items-start justify-between gap-6 desktop:flex-row flex-col"
        >
          <div>
            <h1 className="text-[2.2rem]">{pageText.coursesTitle}</h1>
            <p className="text-ink-soft dark:text-white/60 max-w-[600px]">
              {pageText.coursesSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-8 pt-1">
            <div className="desktop:text-right">
              <div className="text-[1.7rem] font-extrabold leading-none text-ink dark:text-white">
                {inProgressCount}
              </div>
              <div className="font-mono text-[.68rem] font-bold uppercase tracking-wide text-ink-soft dark:text-white/50">
                In progress
              </div>
            </div>
            <div className="desktop:text-right">
              <div className="text-[1.7rem] font-extrabold leading-none text-ink dark:text-white">
                {availableCourses.length}
              </div>
              <div className="font-mono text-[.68rem] font-bold uppercase tracking-wide text-ink-soft dark:text-white/50">
                Total courses
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="relative mt-6">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft dark:text-white/40"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by title or topic..."
            className="w-full bg-white dark:bg-white/5 border-2 border-line dark:border-white/15 dark:text-white rounded-xl pl-10 pr-3.5 py-3 font-body text-[.95rem] focus:border-violet outline-none"
          />
        </FadeIn>

        <FadeIn delay={0.25}>
          <FilterRow
            options={LEVELS.map((l) => ({
              value: l,
              label: l === "all" ? "All courses" : l,
            }))}
            active={filter}
            onChange={setFilter}
          />
        </FadeIn>
      </div>
      {list.length ? (
        <FadeIn delay={0.35} className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6">
          {list.map((c, index) => (
            <div
              key={c.id}
              className="animate-fadeUp"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
            >
              <CourseCard course={c} currentUser={currentUser} />
            </div>
          ))}
        </FadeIn>
      ) : (
        <FadeIn
          delay={0.35}
          as="p"
          className="text-ink-soft dark:text-white/50 py-10 text-center"
        >
          {q ? `No courses match "${query}".` : "No courses match this filter."}
        </FadeIn>
      )}
    </div>
  );
}
