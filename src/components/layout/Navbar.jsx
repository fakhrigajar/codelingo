import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/helpers";
import siteLogo from "../../assets/codelingo.png";
const links = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/grades", label: "Grades" },
  { to: "/community", label: "Community" },
];

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-[100] bg-bg/90 backdrop-blur-md border-b-2 border-line">
      <div className="max-w-[1180px] mx-auto flex items-center gap-6 px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap font-display font-extrabold text-[1.3rem] text-indigo-dark"
        >
          <img className="w-10" src={siteLogo} alt="" />
          CodeLingo
        </Link>
        <nav className="hidden sm:flex gap-1 ml-2 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-bold text-[.98rem] transition-colors ${
                  isActive
                    ? "bg-indigo-dark text-white"
                    : "text-ink-soft hover:bg-[#EAF1FD] hover:text-indigo-dark"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          {currentUser ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 bg-panel border-2 border-line pl-1.5 pr-3.5 py-1.5 rounded-full font-bold"
            >
              <span className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-violet to-coral flex items-center justify-center text-white text-[.85rem] font-extrabold">
                {initials(currentUser.displayName)}
              </span>
              {currentUser.displayName.split(" ")[0]} ·{" "}
              <span className="font-mono text-xs">{currentUser.xp} XP</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/account")}
              className="btn btn-dark btn-sm"
            >
              Log in / Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
