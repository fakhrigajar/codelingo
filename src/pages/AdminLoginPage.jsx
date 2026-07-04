import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { isAdmin, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (isAdmin) return <Navigate to="/admin" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = login(password)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-[380px] w-full bg-white border-2 border-line rounded-[20px] p-9">
        <div className="font-display font-extrabold text-xl text-indigo-dark mb-1">ICT Quest</div>
        <p className="font-mono text-xs text-ink-soft mb-6">Admin panel access</p>
        {error && <div className="bg-[#FFEDEB] text-[#B23B2C] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label>Admin password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-dark w-full" type="submit">
            Enter admin panel
          </button>
        </form>
        <p className="text-[.78rem] text-ink-soft mt-4">
          Demo default password: <code className="font-mono">ictquest-admin</code> — change it in{' '}
          <code className="font-mono">src/data/data.js</code>.
        </p>
      </div>
    </div>
  )
}
