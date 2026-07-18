// An iPhone-style toggle switch: a pill track that fills with the accent
// color and a knob that slides to the opposite edge when checked.
export default function Switch({ checked, onChange, label, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center shrink-0 w-[52px] h-[31px] rounded-full transition-colors duration-200 ${
        checked ? "bg-mint" : "bg-line dark:bg-white/20"
      } ${className}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,.25)] transition-transform duration-200 ${
          checked ? "translate-x-[21px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
