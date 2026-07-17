import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  BookOpen,
  Award,
  Flag,
  Users,
  Database,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../lib/useTheme";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";
import { AdminSaveBarProvider } from "../../context/AdminSaveBarContext";
import ThemeToggle from "../common/ThemeToggle";
import AdminSaveBar from "./AdminSaveBar";
import siteLogo from "../../assets/codelingo.png";

const links = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/paths", label: "Paths", Icon: Route },
  { to: "/admin/courses", label: "Courses", Icon: BookOpen },
  { to: "/admin/badges", label: "Badges", Icon: Award },
  { to: "/admin/posts", label: "Community posts", Icon: Flag },
  { to: "/admin/users", label: "Users", Icon: Users },
  { to: "/admin/data", label: "Backup & reset", Icon: Database },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-[.9rem] transition-colors ${
    isActive
      ? "bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark"
      : "text-ink-soft hover:bg-[#EAF1FD] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

export default function AdminLayout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  // Same burger-menu pattern as the public Navbar: below the `desktop`
  // breakpoint the sidebar becomes a full-screen slide-in panel instead of
  // a column, for both tablet and phone widths.
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [navOpen]);

  useBodyScrollLock(navOpen);

  const handleLogout = () => {
    setNavOpen(false);
    logout();
    navigate("/account");
  };

  const sidebarLinks = (
    <nav className="flex flex-col gap-1.5">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setNavOpen(false)}
          className={navLinkClass}
        >
          <l.Icon size={16} />
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  const sidebarActions = (
    <div className="flex flex-col gap-2 mt-6">
      <ThemeToggle
        theme={theme}
        onToggle={toggleTheme}
        showLabel
        className="btn btn-dark btn-sm w-full justify-center"
      />
      <button
        onClick={() => {
          setNavOpen(false);
          navigate("/");
        }}
        className="btn btn-gold btn-sm w-full inline-flex items-center justify-center gap-1.5"
      >
        <ArrowLeft size={14} /> Back to site
      </button>
      <button
        onClick={handleLogout}
        className="btn bg-red-500 border-red-600 btn-sm w-full text-white"
      >
        Log out
      </button>
    </div>
  );

  return (
    <AdminSaveBarProvider>
      <div className="min-h-screen bg-bg dark:bg-indigo-dark desktop:h-screen desktop:overflow-hidden">
        <div className="desktop:hidden fixed top-0 inset-x-0 z-[110] bg-bg/90 dark:bg-indigo-dark/90 backdrop-blur-md border-b-2 border-line dark:border-white/10 flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center">
            <img src={siteLogo} className="w-8" alt="" />
            <div className="font-display font-extrabold text-base text-indigo-dark dark:text-white ml-1">
              CodeLingo
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen((o) => !o)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-line dark:border-white/15 text-ink-soft dark:text-white/80 hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              {navOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="grid desktop:grid-cols-[220px_1fr] desktop:h-screen">
          <aside className="hidden desktop:block desktop:border-r-2 px-6 desktop:border-line desktop:dark:border-white/10 desktop:pr-6 desktop:h-screen desktop:min-h-0 desktop:overflow-y-auto desktop:overscroll-contain">
            <div className="desktop:sticky desktop:top-8 h-fit">
              <div className="flex items-center mb-2">
                <img src={siteLogo} className="w-10" alt="" />
                <div className="font-display font-extrabold text-lg text-indigo-dark dark:text-white">
                  CodeLingo
                </div>
              </div>
              {sidebarLinks}
              {sidebarActions}
            </div>
          </aside>
          <main className="min-w-0 px-6 pt-24 desktop:pt-8 pb-24 desktop:h-screen desktop:min-h-0 desktop:overflow-y-auto desktop:overscroll-contain">
            <Outlet />
            <AdminSaveBar />
          </main>
        </div>

        <div
          className={`desktop:hidden flex flex-col gap-1 px-6 pb-6 pt-24 fixed inset-0 z-[105] bg-bg dark:bg-indigo-dark transform transition-transform duration-300 ease-in-out ${
            navOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
        >
          {sidebarLinks}
          {sidebarActions}
        </div>
      </div>
    </AdminSaveBarProvider>
  );
}
