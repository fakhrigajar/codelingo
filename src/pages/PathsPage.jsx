import { useState } from "react";
import { useContent } from "../context/ContentContext";
import FilterRow from "../components/common/FilterRow";
import PathCard from "../components/paths/PathCard";

const LEVELS = ["all", "Beginner", "Intermediate", "Advanced"];

export default function PathsPage() {
  const { paths, courses, pageText } = useContent();
  const [filter, setFilter] = useState("all");

  const list = paths.filter((p) => filter === "all" || p.level === filter);

  return (
    <div>
      <div className="pt-12 pb-2.5">
        <h1 className="text-[2.2rem]">{pageText.pathsTitle}</h1>
        <p className="text-ink-soft dark:text-white/60 max-w-[600px]">
          {pageText.pathsSubtitle}
        </p>
        <FilterRow
          options={LEVELS.map((l) => ({
            value: l,
            label: l === "all" ? "All paths" : l,
          }))}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {list.length ? (
        <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6">
          {list.map((path) => (
            <PathCard key={path.id} path={path} courses={courses} />
          ))}
        </div>
      ) : (
        <p className="text-ink-soft dark:text-white/50 py-10 text-center">
          No paths match this filter.
        </p>
      )}
    </div>
  );
}
