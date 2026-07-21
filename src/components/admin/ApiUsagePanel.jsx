import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { API_GROUPS } from "../../lib/apiReference";
import AdminCard from "./AdminCard";

const METHOD_STYLES = {
  GET: "bg-mint text-white",
  POST: "bg-violet text-white",
  PUT: "bg-sun text-indigo-dark",
  PATCH: "bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark",
  DELETE: "bg-coral text-white",
};

export default function ApiUsagePanel() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return API_GROUPS;
    return API_GROUPS.map((group) => ({
      ...group,
      endpoints: group.endpoints.filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q) ||
          e.method.toLowerCase().includes(q) ||
          group.title.toLowerCase().includes(q),
      ),
    })).filter((group) => group.endpoints.length > 0);
  }, [query]);

  return (
    <div>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        Every route this app's server exposes, grouped by resource.
      </p>

      <div className="relative mb-6 max-w-[420px]">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft dark:text-white/40"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by path, method or description..."
          className="w-full pl-10 pr-3.5 py-2.5 border-2 border-line dark:border-white/15 dark:bg-white/5 dark:text-white rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none"
        />
      </div>

      {groups.length === 0 && (
        <AdminCard>
          <p className="text-ink-soft dark:text-white/60 m-0">
            No endpoints match "{query}".
          </p>
        </AdminCard>
      )}

      <div className="space-y-4">
        {groups.map((group) => (
          <AdminCard key={group.title} title={group.title}>
            <div className="font-mono text-[.78rem] text-ink-soft dark:text-white/50 break-all -mt-2 mb-3">
              {group.basePath}
            </div>
            <div className="-mx-5 divide-y-2 divide-line dark:divide-white/10">
              {group.endpoints.map((e, i) => (
                <div
                  key={`${e.method}-${e.path}-${i}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-3"
                >
                  <span
                    className={`shrink-0 w-[62px] text-center font-mono text-[.7rem] font-extrabold rounded-md px-1.5 py-0.5 ${METHOD_STYLES[e.method] || "bg-line text-ink"}`}
                  >
                    {e.method}
                  </span>
                  <span className="font-mono text-[.82rem] text-ink dark:text-white break-all">
                    {e.path}
                  </span>
                  <span className="text-[.82rem] text-ink-soft dark:text-white/60">
                    {e.desc}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
