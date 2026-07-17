import { useEffect, useRef, useState } from "react";
import { AdminButton } from "./AdminFields";
import { useAdminSaveBarState } from "../../context/AdminSaveBarContext";

const EXIT_MS = 300;

// Rendered once inside AdminLayout's main column. Individual admin pages
// never render this — they call useAdminSaveBar() to report unsaved
// changes, and this shows up automatically, fixed to the viewport bottom
// (never over the sidebar), sliding up with a fade to appear and sliding
// back down with a fade — on Save or Discard — to disappear.
export default function AdminSaveBar() {
  const bar = useAdminSaveBarState();
  const dirty = !!bar?.dirty;
  const [mounted, setMounted] = useState(dirty);
  const [visible, setVisible] = useState(false);
  // Keeps the bar's last content around for EXIT_MS after `bar` itself goes
  // null/clean, so the slide-down-and-fade has something to render.
  const lastBarRef = useRef(bar);

  useEffect(() => {
    if (bar) lastBarRef.current = bar;
  }, [bar]);

  useEffect(() => {
    if (dirty) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timeout);
  }, [dirty]);

  if (!mounted || !lastBarRef.current) return null;
  const b = lastBarRef.current;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      {/* Mirrors AdminLayout's grid desktop:grid-cols-[220px_1fr] shell with an
          invisible spacer over the sidebar's column, so this fixed overlay's
          visible portion always lands exactly over the content column. */}
      <div className="grid desktop:grid-cols-[220px_1fr]">
        <div className="hidden desktop:block" aria-hidden="true" />
        <div className="px-6 pb-6 pt-3">
          <div
            className={`pointer-events-auto flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-indigo-dark border-2 border-line dark:border-white/15 rounded-2xl px-5 py-3.5 shadow-monitor transition-all duration-300 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <span className="hidden sm:block text-[.88rem] font-bold text-ink-soft dark:text-white/70">
              {b.message || "You have unsaved changes"}
            </span>
            <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
              {b.onDiscard && (
                <AdminButton
                  type="button"
                  className="text-center !bg-coral"
                  onClick={b.onDiscard}
                >
                  Discard
                </AdminButton>
              )}
              <AdminButton
                type="button"
                className="text-center"
                onClick={b.onSave}
              >
                Save changes
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
