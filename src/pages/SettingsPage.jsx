import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function SettingsPage() {
  const { currentUser, updateAccount } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState(currentUser.displayName)
  const [username, setUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords don't match.")
      return
    }

    const res = updateAccount({ displayName, username, email, currentPassword, newPassword })
    if (!res.ok) {
      setError(res.error)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast('Account updated!')
    navigate('/profile')
  }

  return (
    <div className="max-w-[520px] mx-auto my-16 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[20px] p-9">
      <h1 className="text-[1.5rem] mb-1">Account settings</h1>
      <p className="text-[.85rem] text-ink-soft dark:text-white/50 mb-6">
        Update your profile info or password below.
      </p>

      {error && (
        <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label>Display name</label>
          <input
            type="text"
            required
            maxLength={30}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="field mb-4">
          <label>Username</label>
          <input
            type="text"
            required
            maxLength={20}
            pattern="[A-Za-z0-9_]+"
            title="Letters, numbers and underscore only"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="field mb-4">
          <label>Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-6 border-t-2 border-line dark:border-white/10" />

        <div className="field mb-4">
          <label>New password</label>
          <input
            type="password"
            minLength={4}
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="field mb-4">
          <label>Confirm new password</label>
          <input
            type="password"
            minLength={4}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="field mb-6">
          <label>Current password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Required to save changes"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button className="btn btn-primary flex-1" type="submit">
            Save changes
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
