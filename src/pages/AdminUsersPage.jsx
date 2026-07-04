import { useState } from 'react'
import { getAllUsers, saveAllUsers, deleteUser } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AdminCard from '../components/admin/AdminCard'
import { AdminButton } from '../components/admin/AdminFields'

export default function AdminUsersPage() {
  const [users, setUsers] = useState(getAllUsers())
  const toast = useToast()
  const list = Object.values(users).sort((a, b) => new Date(b.joined) - new Date(a.joined))

  const refresh = () => setUsers(getAllUsers())

  const handleDelete = (username) => {
    if (!confirm(`Delete the account "${username}"? This cannot be undone.`)) return
    deleteUser(username)
    refresh()
    toast('Account deleted')
  }

  const handleResetProgress = (username) => {
    if (!confirm(`Reset all XP, badges and lesson progress for "${username}"?`)) return
    const all = getAllUsers()
    const user = all[username]
    if (!user) return
    all[username] = { ...user, xp: 0, badges: [], completed: {} }
    saveAllUsers(all)
    refresh()
    toast('Progress reset')
  }

  return (
    <div>
      <h1 className="text-2xl mb-1">Users</h1>
      <p className="text-ink-soft mb-6">
        {list.length} registered learner{list.length === 1 ? '' : 's'}. Accounts are stored locally in this browser.
      </p>

      {list.length === 0 && (
        <AdminCard>
          <p className="text-ink-soft m-0">No one has signed up yet.</p>
        </AdminCard>
      )}

      <div className="space-y-3">
        {list.map((u) => {
          const totalCompleted = Object.values(u.completed || {}).reduce((a, arr) => a + arr.length, 0)
          return (
            <AdminCard key={u.username}>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <div className="font-extrabold">
                    {u.displayName} <span className="text-ink-soft font-mono text-[.8rem]">@{u.username}</span>
                  </div>
                  <div className="text-ink-soft text-[.85rem] mt-0.5">
                    Age {u.age} · {u.xp} XP · {totalCompleted} lessons done · {u.badges.length} badges · joined{' '}
                    {new Date(u.joined).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <AdminButton variant="outline" onClick={() => handleResetProgress(u.username)}>
                    Reset progress
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => handleDelete(u.username)}>
                    Delete account
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
