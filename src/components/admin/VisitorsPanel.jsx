import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { listVisits, clearVisits } from "../../lib/visitApi";
import { useToast } from "../../context/ToastContext";
import AdminCard from "./AdminCard";
import { AdminButton } from "./AdminFields";

export default function VisitorsPanel() {
  const [visits, setVisits] = useState([]);
  const [ready, setReady] = useState(false);
  const toast = useToast();

  const refresh = () => listVisits().then(setVisits);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, []);

  const handleClear = async () => {
    if (!confirm("Clear all recorded visits? This cannot be undone.")) return;
    await clearVisits();
    refresh();
    toast("Visitor log cleared");
  };

  if (!ready) return null;

  return (
    <div>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        {visits.length} recorded visit{visits.length === 1 ? "" : "s"}
        {visits.length >= 500 ? " (showing the most recent 500)" : ""}.
      </p>

      <AdminCard
        actions={
          visits.length > 0 && (
            <AdminButton variant="danger" onClick={handleClear}>
              <span className="inline-flex items-center gap-1.5">
                <Trash2 size={14} /> Clear log
              </span>
            </AdminButton>
          )
        }
      >
        {visits.length === 0 ? (
          <p className="text-ink-soft dark:text-white/60 m-0">
            No visits recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="text-[.72rem] font-bold text-ink-soft/60 dark:text-white/40 uppercase tracking-wide">
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Page</th>
                  <th className="px-2 py-2">IP</th>
                  <th className="px-2 py-2">Country</th>
                  <th className="px-2 py-2">City</th>
                  <th className="px-2 py-2">Browser</th>
                  <th className="px-2 py-2">OS</th>
                  <th className="px-2 py-2">Device</th>
                  <th className="px-2 py-2">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v, i) => (
                  <tr
                    key={v.id}
                    className={`text-[.85rem] ${i % 2 === 0 ? "bg-bg dark:bg-white/[0.02]" : ""}`}
                  >
                    <td className="px-2 py-2.5 font-mono text-[.75rem] text-ink-soft dark:text-white/60 rounded-l-xl whitespace-nowrap">
                      {new Date(v.time).toLocaleString([], { hour12: false })}
                    </td>
                    <td className="px-2 py-2.5 font-mono text-[.8rem] truncate max-w-[160px]">
                      {v.path}
                    </td>
                    <td className="px-2 py-2.5 font-mono text-[.8rem] whitespace-nowrap">
                      {v.ip}
                    </td>
                    <td className="px-2 py-2.5 whitespace-nowrap">{v.country}</td>
                    <td className="px-2 py-2.5 whitespace-nowrap">{v.city}</td>
                    <td className="px-2 py-2.5 whitespace-nowrap">{v.browser}</td>
                    <td className="px-2 py-2.5 whitespace-nowrap">{v.os}</td>
                    <td className="px-2 py-2.5 whitespace-nowrap">{v.device}</td>
                    <td className="px-2 py-2.5 truncate max-w-[220px] rounded-r-xl">
                      {v.referrer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
