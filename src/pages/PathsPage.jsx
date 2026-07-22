import { useState } from "react";
import { useContent } from "../context/ContentContext";
import FilterRow from "../components/common/FilterRow";
import PathCard from "../components/paths/PathCard";
import FadeIn from "../components/common/FadeIn";

const LEVELS = ["all", "Beginner", "Intermediate", "Advanced"];

export default function PathsPage() {
  const { paths, courses, pageText } = useContent();
  const [filter, setFilter] = useState("all");

  const list = paths.filter((p) => filter === "all" || p.level === filter);

  return (
    <div>
      <div className="pt-12 pb-2.5">
        <FadeIn delay={0.05}>
          <h1 className="text-[2.2rem]">{pageText.pathsTitle}</h1>
          <p className="text-ink-soft dark:text-white/60 max-w-[600px]">
            {pageText.pathsSubtitle}
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <FilterRow
            options={LEVELS.map((l) => ({
              value: l,
              label: l === "all" ? "All paths" : l,
            }))}
            active={filter}
            onChange={setFilter}
          />
        </FadeIn>
      </div>

      {list.length ? (
        <FadeIn delay={0.25} className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6">
          {list.map((path, index) => (
            <div
              key={path.id}
              className="animate-fadeUp"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
            >
              <PathCard path={path} courses={courses} />
            </div>
          ))}
        </FadeIn>
      ) : (
        <FadeIn
          delay={0.25}
          as="p"
          className="text-ink-soft dark:text-white/50 py-10 text-center"
        >
          No paths match this filter.
        </FadeIn>
      )}
    </div>
  );
}
