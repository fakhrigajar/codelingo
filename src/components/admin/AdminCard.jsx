export default function AdminCard({ title, actions, children, className = '' }) {
  return (
    <div className={`bg-white border-2 border-line rounded-2xl p-5 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          {title && <h3 className="m-0 text-[1.1rem]">{title}</h3>}
          {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
