import { useEffect, useState } from "react";
import { ChevronDown, Shield, RotateCcw, Trash2 } from "lucide-react";
import { getAllUsers, saveUser, deleteUser } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AdminCard from "./AdminCard";
import IconButtonWithTooltip from "../common/IconButtonWithTooltip";
import Avatar from "../common/Avatar";

export default function RegisteredUsersPanel() {
  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());
  const toast = useToast();
  const list = [...users].sort(
    (a, b) => new Date(b.joined) - new Date(a.joined),
  );

  const refresh = () => getAllUsers().then(setUsers);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, []);

  const toggleExpanded = (username) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  const handleDelete = async (username) => {
    if (!confirm(`Delete the account "${username}"? This cannot be undone.`))
      return;
    await deleteUser(username);
    refresh();
    toast("Account deleted");
  };

  const handleResetProgress = async (username) => {
    if (!confirm(`Reset all XP, badges and lesson progress for "${username}"?`))
      return;
    const user = users.find((u) => u.username === username);
    if (!user) return;
    await saveUser({ ...user, xp: 0, badges: [], completed: {} });
    refresh();
    toast("Progress reset");
  };

  const handleToggleRole = async (username) => {
    const user = users.find((u) => u.username === username);
    if (!user) return;
    const nextRole = user.role === "admin" ? "community" : "admin";
    if (
      !confirm(
        `${nextRole === "admin" ? "Grant" : "Remove"} admin access ${nextRole === "admin" ? "to" : "from"} "${username}"?`,
      )
    )
      return;
    await saveUser({ ...user, role: nextRole });
    refresh();
    toast(
      nextRole === "admin" ? "User is now an admin" : "Admin access removed",
    );
  };

  if (!ready) return null;

  return (
    <div>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        {list.length} registered learner{list.length === 1 ? "" : "s"}. Accounts
        are stored on the server.
      </p>

      {list.length === 0 && (
        <AdminCard>
          <p className="text-ink-soft dark:text-white/60 m-0">
            No one has signed up yet.
          </p>
        </AdminCard>
      )}

      <div className="space-y-3">
        {list.map((u) => {
          const totalCompleted = Object.values(u.completed || {}).reduce(
            (a, arr) => a + arr.length,
            0,
          );
          const isOpen = expanded.has(u.username);
          return (
            <AdminCard key={u.username}>
              <button
                type="button"
                onClick={() => toggleExpanded(u.username)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 min-w-0 text-left"
              >
                <Avatar user={u} size={40} />
                <span className="font-extrabold truncate flex-1">
                  {u.displayName}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink-soft dark:text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="mt-4 pt-4 border-t-2 border-line dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-soft dark:text-white/50 text-[.85rem]">
                    <span className="font-mono">@{u.username}</span>
                    {u.role === "admin" && (
                      <span className="text-[.7rem] font-bold bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark rounded-full px-2 py-0.5">
                        Admin
                      </span>
                    )}
                    <span>Age {u.age}</span>
                    <span>{u.xp} XP</span>
                    <span>
                      {totalCompleted} lesson{totalCompleted === 1 ? "" : "s"}{" "}
                      done
                    </span>
                    <span>
                      {u.badges.length} badge{u.badges.length === 1 ? "" : "s"}
                    </span>
                    <span>Joined {new Date(u.joined).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2.5 mt-4">
                    <IconButtonWithTooltip
                      icon={Shield}
                      tooltip={u.role === "admin" ? "Remove admin" : "Make admin"}
                      onClick={() => handleToggleRole(u.username)}
                    />
                    <IconButtonWithTooltip
                      icon={RotateCcw}
                      tooltip="Reset progress"
                      onClick={() => handleResetProgress(u.username)}
                    />
                    <IconButtonWithTooltip
                      icon={Trash2}
                      tooltip="Delete account"
                      variant="danger"
                      onClick={() => handleDelete(u.username)}
                    />
                  </div>
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
