export function AdminInput({ label, className = '', ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">{label}</span>}
      <input
        {...props}
        className={`w-full px-3 py-2.5 border-2 border-line dark:border-white/15 dark:bg-white/5 dark:text-white rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none ${className}`}
      />
    </label>
  )
}

export function AdminTextarea({ label, className = '', ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">{label}</span>}
      <textarea
        {...props}
        className={`w-full px-3 py-2.5 border-2 border-line dark:border-white/15 dark:bg-white/5 dark:text-white rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none min-h-[90px] resize-y ${className}`}
      />
    </label>
  )
}

export function AdminSelect({ label, className = '', children, ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">{label}</span>}
      <select
        {...props}
        className={`select-caret w-full pl-3 py-2.5 border-2 border-line dark:border-white/15 rounded-[10px] font-body text-[.92rem] focus:border-violet outline-none bg-white dark:bg-white/5 dark:text-white ${className}`}
      >
        {children}
      </select>
    </label>
  )
}

export function AdminImageUpload({ label, value, onChange, preview, buttonLabel = 'Upload image', disabled = false }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="mb-3">
      {label && <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">{label}</span>}
      <div className="flex items-center gap-3">
        {preview}
        <label
          className={`px-3.5 py-2 rounded-[10px] font-bold text-[.85rem] bg-white text-indigo-dark border-2 border-line dark:bg-white/10 dark:text-white dark:border-white/15 cursor-pointer hover:opacity-85 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {buttonLabel}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={disabled} />
        </label>
        {value && (
          <AdminButton type="button" variant="ghost" onClick={() => onChange('')} disabled={disabled}>
            Remove
          </AdminButton>
        )}
      </div>
    </div>
  )
}

export function AdminButton({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark',
    danger: 'bg-coral text-white',
    outline: 'bg-white text-indigo-dark border-2 border-line dark:bg-white/10 dark:text-white dark:border-white/15',
    ghost: 'bg-transparent text-ink-soft dark:text-white/60',
  }
  return (
    <button
      {...props}
      className={`px-3.5 py-2 rounded-[10px] font-bold text-[.85rem] transition-opacity hover:opacity-85 disabled:opacity-40 ${variants[variant]} ${className}`}
    />
  )
}
