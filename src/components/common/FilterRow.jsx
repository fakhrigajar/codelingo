export default function FilterRow({ options, active, onChange }) {
  return (
    <div className="flex gap-2.5 flex-wrap my-6">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`border-2 rounded-full px-4 py-2 font-bold text-[.85rem] transition-colors ${
            active === opt.value
              ? 'bg-indigo-dark border-indigo-dark text-white'
              : 'bg-white border-line text-ink-soft'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
