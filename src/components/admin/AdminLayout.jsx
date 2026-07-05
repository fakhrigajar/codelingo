import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

const links = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/grades', label: '🗺️ Grades' },
  { to: '/admin/courses', label: '📚 Courses' },
  { to: '/admin/badges', label: '🏅 Badges' },
  { to: '/admin/rooms', label: '💬 Chat rooms' },
  { to: '/admin/users', label: '👤 Users' },
  { to: '/admin/data', label: '🗄️ Backup & reset' },
]

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1180px] mx-auto px-6 py-8 grid desktop:grid-cols-[220px_1fr] gap-8">
        <aside className="desktop:sticky desktop:top-8 h-fit">
          <div className="font-display font-extrabold text-lg text-indigo-dark mb-1">CodeLingo</div>
          <div className="font-mono text-xs text-ink-soft mb-5">Admin panel</div>
          <nav className="flex desktop:flex-col gap-1.5 flex-wrap">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl font-bold text-[.9rem] transition-colors ${
                    isActive ? 'bg-indigo-dark text-white' : 'text-ink-soft hover:bg-[#EAF1FD]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex desktop:flex-col gap-2 mt-6">
            <button onClick={() => navigate('/')} className="btn btn-outline btn-sm w-full">
              ← Back to site
            </button>
            <button onClick={handleLogout} className="btn btn-outline btn-sm w-full">
              Log out
            </button>
          </div>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
