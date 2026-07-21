// A segmented-control tab switcher shared by admin pages that group two
// related views under one sidebar entry (Users: registered/visitors,
// System: backup/API usage) instead of giving each its own nav link.
export default function AdminTabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 mb-6 rounded-xl bg-line/50 dark:bg-white/5">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 rounded-lg font-bold text-[.85rem] transition-colors ${
            active === t.value
              ? "bg-white dark:bg-white/10 text-indigo-dark dark:text-white shadow-sm"
              : "text-ink-soft dark:text-white/50 hover:text-ink dark:hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
