import { useEffect, useState } from "react";
import { getAllUsers, saveUser, deleteUser } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { initials } from "../lib/helpers";
import AdminCard from "../components/admin/AdminCard";
import { AdminButton } from "../components/admin/AdminFields";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);
  const toast = useToast();
  const list = [...users].sort(
    (a, b) => new Date(b.joined) - new Date(a.joined),
  );

  const refresh = () => getAllUsers().then(setUsers);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, []);

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
      <h1 className="text-2xl mb-1">Users</h1>
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
          return (
            <AdminCard key={u.username}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-coral flex items-center justify-center text-white text-[.85rem] font-extrabold shrink-0">
                    {initials(u.displayName)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate">{u.displayName}</span>
                      <span className="text-ink-soft dark:text-white/50 font-mono text-[.8rem] font-normal">
                        @{u.username}
                      </span>
                      {u.role === "admin" && (
                        <span className="text-[.7rem] font-bold bg-indigo-dark text-white dark:bg-white dark:text-indigo-dark rounded-full px-2 py-0.5">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-ink-soft dark:text-white/50 text-[.85rem] mt-1">
                      <span>Age {u.age}</span>
                      <span>{u.xp} XP</span>
                      <span>
                        {totalCompleted} lesson{totalCompleted === 1 ? "" : "s"}{" "}
                        done
                      </span>
                      <span>
                        {u.badges.length} badge
                        {u.badges.length === 1 ? "" : "s"}
                      </span>
                      <span>
                        Joined {new Date(u.joined).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                  <AdminButton
                    className="bg-ink"
                    onClick={() => handleToggleRole(u.username)}
                  >
                    {u.role === "admin" ? "Remove admin" : "Make admin"}
                  </AdminButton>
                  <AdminButton
                    className="bg-ink"
                    onClick={() => handleResetProgress(u.username)}
                  >
                    Reset progress
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    onClick={() => handleDelete(u.username)}
                    className="col-span-2 sm:col-span-1"
                  >
                    Delete account
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
