import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const { currentUser, ready } = useAuth()
  if (!ready) return null
  if (!currentUser) return <Navigate to="/account" replace />
  return children
}
