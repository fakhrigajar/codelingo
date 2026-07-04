import { createContext, useContext, useState, useCallback } from 'react'
import { storageGet, storageSet, storageRemove } from '../lib/storage'
import { ADMIN_PASSWORD } from '../data/data'

const AdminAuthContext = createContext(null)

const ADMIN_SESSION_KEY = 'admin_session'

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => storageGet(ADMIN_SESSION_KEY, false) === true)

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      storageSet(ADMIN_SESSION_KEY, true)
      return { ok: true }
    }
    return { ok: false, error: 'Incorrect admin password.' }
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
    storageRemove(ADMIN_SESSION_KEY)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  return ctx
}
