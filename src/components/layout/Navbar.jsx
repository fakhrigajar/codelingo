import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../lib/useTheme";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";
import { TOOLS } from "../../lib/toolsList";
import ThemeToggle from "../common/ThemeToggle";
import Avatar from "../common/Avatar";
import siteLogo from "../../assets/navbar-logo.png";
const links = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/paths", label: "Paths" },
  { to: "/community", label: "Community" },
];

const navLinkClass = ({ isActive }) =>
  `px-4 py-2.5 rounded-xl font-bold text-[.98rem] transition-colors ${
    isActive
      ? "bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark"
      : "text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

// Hover-triggered dropdown for the "Tools" nav item — there's no more /tools
// landing page, so this trigger only ever opens the menu; picking an item is
// the only way in. Click-to-toggle is kept alongside hover so it still works
// without a mouse (touch, keyboard).
function ToolsNavDropdown() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const isActive = location.pathname.startsWith("/tools");

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 ${navLinkClass({ isActive })}`}
      >
        Tools
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full w-56 pt-2">
          <div className="bg-white dark:bg-indigo-dark border-2 border-line dark:border-white/15 rounded-2xl shadow-lg py-1.5 overflow-hidden">
            {TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 font-bold text-[.9rem] text-ink dark:text-white hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
              >
                <tool.Icon size={16} className="text-violet shrink-0" />
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

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
    setMenuOpen(false);
    navigate("/");
    logout();
  };

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[110] bg-bg/90 dark:bg-indigo-dark/90 backdrop-blur-md border-b-2 border-line dark:border-white/10 transition-colors">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
          <Link
            to="/"
            className="flex items-center gap font-display font-extrabold text-[1.3rem] text-indigo-dark dark:text-white"
          >
            <img className="w-28" src={siteLogo} alt="" />
          </Link>
          <nav className="hidden desktop:flex items-center gap-1 ml-2 flex-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={navLinkClass}
              >
                {l.label}
              </NavLink>
            ))}
            <ToolsNavDropdown />
          </nav>
          <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
            <ThemeToggle
              theme={theme}
              onToggle={toggleTheme}
              className="hidden desktop:flex btn btn-dark rounded-full w-12 h-12 p-0"
            />
            {currentUser ? (
              <div className="relative hidden desktop:block" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="btn btn-dark h-12 rounded-full pl-1.5 pr-2 sm:pr-3.5 py-0 normal-case tracking-normal font-bold"
                >
                  <Avatar user={currentUser} size={30} />
                  <span className="hidden sm:inline whitespace-nowrap">
                    {currentUser.displayName.split(" ")[0]} ·{" "}
                    <span className="font-mono text-xs">
                      {currentUser.xp} XP
                    </span>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-indigo-dark border-2 border-line dark:border-white/15 rounded-2xl shadow-lg py-1.5 overflow-hidden"
                  >
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2.5 font-bold text-[.9rem] text-ink dark:text-white hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full text-left px-4 py-2.5 font-bold text-[.9rem] text-ink dark:text-white hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
                    >
                      Settings
                    </button>
                    <div className="my-1 border-t-2 border-line dark:border-white/10" />
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 font-bold text-[.9rem] text-coral hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/account")}
                className="btn btn-primary btn-sm hidden desktop:block"
              >
                Log in / Sign up
              </button>
            )}
            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
              className="desktop:hidden flex items-center justify-center w-10 h-10 rounded-full border-2 border-line dark:border-white/15 text-ink-soft dark:text-white/80 hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
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
        </div>
      </div>
      <nav
        className={`desktop:hidden flex flex-col gap-1 px-6 pb-4 pt-[6rem] fixed inset-0 z-[105] bg-bg dark:bg-indigo-dark transform transition-transform duration-300 ease-in-out ${
          navOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            tabIndex={navOpen ? 0 : -1}
            onClick={() => setNavOpen(false)}
            className={navLinkClass}
          >
            {l.label}
          </NavLink>
        ))}
        <span className="px-4 pt-3 pb-1 font-bold text-[.75rem] uppercase tracking-wide text-ink-soft/60 dark:text-white/30">
          Tools
        </span>
        {TOOLS.map((tool) => (
          <NavLink
            key={tool.to}
            to={tool.to}
            tabIndex={navOpen ? 0 : -1}
            onClick={() => setNavOpen(false)}
            className={({ isActive }) => `flex items-center gap-2.5 ${navLinkClass({ isActive })}`}
          >
            <tool.Icon size={16} />
            {tool.title}
          </NavLink>
        ))}
        <div className="my-2 border-t-2 border-line dark:border-white/10" />
        <ThemeToggle
          theme={theme}
          onToggle={toggleTheme}
          showLabel
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[.98rem] text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
        />
        <div className="my-2 border-t-2 border-line dark:border-white/10" />
        {currentUser ? (
          <>
            <div className="flex items-center gap-2.5 px-4 py-2">
              <Avatar user={currentUser} size={30} />
              <span className="font-bold text-ink dark:text-white whitespace-nowrap">
                {currentUser.displayName.split(" ")[0]} ·{" "}
                <span className="font-mono text-xs">{currentUser.xp} XP</span>
              </span>
            </div>
            <button
              type="button"
              tabIndex={navOpen ? 0 : -1}
              onClick={() => {
                setNavOpen(false);
                navigate("/profile");
              }}
              className="text-left px-4 py-2.5 rounded-xl font-bold text-[.98rem] text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            >
              Profile
            </button>
            <button
              type="button"
              tabIndex={navOpen ? 0 : -1}
              onClick={() => {
                setNavOpen(false);
                navigate("/settings");
              }}
              className="text-left px-4 py-2.5 rounded-xl font-bold text-[.98rem] text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            >
              Settings
            </button>
            <button
              type="button"
              tabIndex={navOpen ? 0 : -1}
              onClick={() => {
                setNavOpen(false);
                handleLogout();
              }}
              className="text-left px-4 py-2.5 rounded-xl font-bold text-[.98rem] text-coral hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            tabIndex={navOpen ? 0 : -1}
            onClick={() => {
              setNavOpen(false);
              navigate("/account");
            }}
            className="btn btn-primary btn-sm mx-4 mt-1"
          >
            Log in / Sign up
          </button>
        )}
      </nav>
    </>
  );
}
