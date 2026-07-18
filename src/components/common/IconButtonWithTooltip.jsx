// A native `title` attribute has an inconsistent OS-controlled delay and no
// animation — this renders its own tooltip above the button that fades and
// slides up on hover, so it always looks and behaves the same everywhere.
export default function IconButtonWithTooltip({
  icon: Icon,
  tooltip,
  variant = "default",
  className = "",
  ...buttonProps
}) {
  const variants = {
    default: "bg-ink dark:bg-white/10 text-white",
    danger: "bg-coral text-white",
  };

  return (
    <div className="relative group/tip inline-block">
      <button
        type="button"
        aria-label={tooltip}
        className={`w-9 h-9 flex items-center justify-center rounded-[10px] transition-opacity hover:opacity-85 disabled:opacity-40 ${variants[variant]} ${className}`}
        {...buttonProps}
      >
        <Icon size={16} aria-hidden="true" />
      </button>
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] whitespace-normal rounded-lg bg-indigo-dark dark:bg-white px-2.5 py-1.5 text-center text-[.72rem] font-bold text-white dark:text-indigo-dark opacity-0 translate-y-1 transition-all duration-200 z-20 group-hover/tip:opacity-100 group-hover/tip:translate-y-0"
      >
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-dark dark:border-t-white" />
      </div>
    </div>
  );
}
