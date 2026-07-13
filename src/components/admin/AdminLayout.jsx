import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  BookOpen,
  Award,
  MessageCircle,
  Users,
  Database,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../lib/useTheme";
import ThemeToggle from "../common/ThemeToggle";
import siteLogo from "../../assets/codelingo.png";

const links = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/paths", label: "Paths", Icon: Route },
  { to: "/admin/courses", label: "Courses", Icon: BookOpen },
  { to: "/admin/badges", label: "Badges", Icon: Award },
  { to: "/admin/rooms", label: "Chat rooms", Icon: MessageCircle },
  { to: "/admin/users", label: "Users", Icon: Users },
  { to: "/admin/data", label: "Backup & reset", Icon: Database },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-indigo-dark">
      <div className="max-w-[1180px] mx-auto grid desktop:grid-cols-[220px_1fr] desktop:min-h-screen">
        <aside className="desktop:border-r-2 px-6 desktop:border-line desktop:dark:border-white/10 desktop:pr-6">
          <div className="desktop:sticky desktop:top-8 h-fit">
            <div className="flex items-center mb-2">
              <img src={siteLogo} className="w-10" alt="" />
              <div className="font-display font-extrabold text-lg text-indigo-dark dark:text-white">
                CodeLingo
              </div>
            </div>
            <nav className="flex desktop:flex-col gap-1.5 flex-wrap">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-[.9rem] transition-colors ${
                      isActive
                        ? "bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark"
                        : "text-ink-soft hover:bg-[#EAF1FD] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                    }`
                  }
                >
                  <l.Icon size={16} />
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex desktop:flex-col gap-2 mt-6">
              <ThemeToggle
                theme={theme}
                onToggle={toggleTheme}
                showLabel
                className="btn btn-outline btn-sm w-full justify-center"
              />
              <button
                onClick={() => navigate("/")}
                className="btn btn-outline btn-sm w-full inline-flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back to site
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm w-full"
              >
                Log out
              </button>
            </div>
          </div>
        </aside>
        <main className="min-w-0 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
