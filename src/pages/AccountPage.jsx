import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AccountPage() {
  const { currentUser, login, signup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [suName, setSuName] = useState('')
  const [suUsername, setSuUsername] = useState('')
  const [suAge, setSuAge] = useState('')
  const [suPassword, setSuPassword] = useState('')

  if (currentUser) return <Navigate to="/profile" replace />

  const switchTab = (t) => {
    setTab(t)
    setError('')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const res = login(loginUsername, loginPassword)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast(`Welcome back, ${res.user.displayName.split(' ')[0]}!`)
    navigate('/profile')
  }

  const handleSignup = (e) => {
    e.preventDefault()
    const res = signup({ displayName: suName, username: suUsername, age: suAge, password: suPassword })
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast(`Welcome to ICT Quest, ${res.user.displayName.split(' ')[0]}! 🎉`)
    navigate('/profile')
  }

  return (
    <div className="max-w-[440px] mx-auto my-16 bg-white border-2 border-line rounded-[20px] p-9">
      <div className="flex gap-2 mb-6 bg-[#F1F5FD] rounded-xl p-1">
        <button
          onClick={() => switchTab('login')}
          className={`flex-1 py-2.5 rounded-[9px] font-extrabold ${
            tab === 'login' ? 'bg-white text-indigo-dark shadow-[0_2px_6px_rgba(27,38,71,.12)]' : 'text-ink-soft'
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => switchTab('signup')}
          className={`flex-1 py-2.5 rounded-[9px] font-extrabold ${
            tab === 'signup' ? 'bg-white text-indigo-dark shadow-[0_2px_6px_rgba(27,38,71,.12)]' : 'text-ink-soft'
          }`}
        >
          Sign up
        </button>
      </div>

      {error && <div className="bg-[#FFEDEB] text-[#B23B2C] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">{error}</div>}

      {tab === 'login' ? (
        <form onSubmit={handleLogin}>
          <div className="field mb-4">
            <label>Username</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
          </div>
          <div className="field mb-4">
            <label>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Log in
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <div className="field mb-4">
            <label>Display name</label>
            <input type="text" required maxLength={30} value={suName} onChange={(e) => setSuName(e.target.value)} />
          </div>
          <div className="field mb-4">
            <label>Username</label>
            <input
              type="text"
              required
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              title="Letters, numbers and underscore only"
              value={suUsername}
              onChange={(e) => setSuUsername(e.target.value)}
            />
          </div>
          <div className="field mb-4">
            <label>Age</label>
            <select required value={suAge} onChange={(e) => setSuAge(e.target.value)}>
              <option value="">Select age</option>
              {[7, 8, 9, 10, 11, 12, 13, '14+'].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="field mb-4">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={4}
              autoComplete="new-password"
              value={suPassword}
              onChange={(e) => setSuPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Create account
          </button>
        </form>
      )}
      <p className="text-[.78rem] text-ink-soft mt-4">
        This is a demo account system for practicing ICT Quest — please don't use a real or important password.
      </p>
    </div>
  )
}
