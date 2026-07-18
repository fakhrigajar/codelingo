import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchPublicUsers } from '../lib/publicUsers'

const PublicUsersContext = createContext(null)

// A lightweight, non-sensitive directory of every user (username, avatar
// only) so pages showing other people's content — community posts, lesson
// discussions — can render their live avatar instead of only ever knowing
// about currentUser. Refetches on window focus so an avatar someone else
// just changed shows up without needing a full page reload.
export function PublicUsersProvider({ children }) {
  const [byUsername, setByUsername] = useState(new Map())

  const refresh = useCallback(() => {
    fetchPublicUsers()
      .then((list) => setByUsername(new Map(list.map((u) => [u.username, u]))))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refresh])

  const value = { getUser: (username) => byUsername.get(username) }

  return <PublicUsersContext.Provider value={value}>{children}</PublicUsersContext.Provider>
}

export function usePublicUsers() {
  const ctx = useContext(PublicUsersContext)
  if (!ctx) throw new Error('usePublicUsers must be used within a PublicUsersProvider')
  return ctx
}
