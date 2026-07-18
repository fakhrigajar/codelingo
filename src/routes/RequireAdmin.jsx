import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { currentUser, ready } = useAuth()
  if (!ready) return null
  if (currentUser?.role !== 'admin') return <Navigate to="/account" replace />
  return children
}
