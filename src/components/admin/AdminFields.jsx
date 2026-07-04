export function AdminInput({ label, className = '', ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft">{label}</span>}
      <input
        {...props}
        className={`w-full px-3 py-2.5 border-2 border-line rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none ${className}`}
      />
    </label>
  )
}

export function AdminTextarea({ label, className = '', ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft">{label}</span>}
      <textarea
        {...props}
        className={`w-full px-3 py-2.5 border-2 border-line rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none min-h-[90px] resize-y ${className}`}
      />
    </label>
  )
}

export function AdminSelect({ label, className = '', children, ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft">{label}</span>}
      <select
        {...props}
        className={`w-full px-3 py-2.5 border-2 border-line rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none bg-white ${className}`}
      >
        {children}
      </select>
    </label>
  )
}

export function AdminButton({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-indigo-dark text-white',
    danger: 'bg-coral text-white',
    outline: 'bg-white text-indigo-dark border-2 border-line',
    ghost: 'bg-transparent text-ink-soft',
  }
  return (
    <button
      {...props}
      className={`px-3.5 py-2 rounded-[10px] font-bold text-[.85rem] transition-opacity hover:opacity-85 disabled:opacity-40 ${variants[variant]} ${className}`}
    />
  )
}
