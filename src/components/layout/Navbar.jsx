import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/helpers";
import { storageGet, storageSet } from "../../lib/storage";
import siteLogo from "../../assets/codelingo.png";
const links = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/grades", label: "Grades" },
  { to: "/community", label: "Community" },
];

function getInitialTheme() {
  const stored = storageGet("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    storageSet("theme", theme);
  }, [theme]);

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

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/");
    logout();
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl font-bold text-[.98rem] transition-colors ${
      isActive
        ? "bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark"
        : "text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-[100] bg-bg/90 dark:bg-indigo-dark/90 backdrop-blur-md border-b-2 border-line dark:border-white/10 transition-colors">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap font-display font-extrabold text-[1.3rem] text-indigo-dark dark:text-white"
        >
          <img className="w-10" src={siteLogo} alt="" />
          CodeLingo
        </Link>
        <nav className="hidden desktop:flex gap-1 ml-2 flex-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={theme === "dark"}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="hidden desktop:flex items-center justify-center w-10 h-10 rounded-full border-2 border-line bg-indigo-dark dark:bg-white dark:text-indigo-dark dark:border-white/15 text-white transition-colors"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 2a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18.5a1 1 0 0 1 1-1Zm7.5-6.5a1 1 0 0 1-1 1H17a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1ZM7 12a1 1 0 0 1-1 1H4.5a1 1 0 1 1 0-2H6a1 1 0 0 1 1 1Zm10.03-5.03a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM8.45 15.45a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0Zm9.13 2.48a1 1 0 0 1-1.42 0l-1.06-1.06a1 1 0 1 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42ZM7.39 7.39A1 1 0 0 1 5.97 7.4L4.9 6.34a1 1 0 1 1 1.42-1.42L7.4 5.97a1 1 0 0 1 0 1.42Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M20.35 14.5A8.5 8.5 0 0 1 9.5 3.65a.75.75 0 0 0-.9-.98A9.5 9.5 0 1 0 21.33 15.4a.75.75 0 0 0-.98-.9Z" />
              </svg>
            )}
          </button>
          {currentUser ? (
            <div className="relative hidden desktop:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 bg-panel dark:bg-white/10 border-2 border-line dark:border-white/15 pl-1.5 pr-2 sm:pr-3.5 py-1.5 rounded-full font-bold text-ink dark:text-white"
              >
                <span className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-violet to-coral flex items-center justify-center text-white text-[.85rem] font-extrabold shrink-0">
                  {initials(currentUser.displayName)}
                </span>
                <span className="hidden sm:inline whitespace-nowrap">
                  {currentUser.displayName.split(" ")[0]} ·{" "}
                  <span className="font-mono text-xs">{currentUser.xp} XP</span>
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
              className="btn btn-sm hidden desktop:block  bg-indigo-dark dark:bg-white dark:text-indigo-dark text-white"
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
      {navOpen && (
        <nav className="desktop:hidden flex flex-col gap-1 px-6 pb-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setNavOpen(false)}
              className={navLinkClass}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
