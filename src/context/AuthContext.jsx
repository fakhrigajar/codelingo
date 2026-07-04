import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageGet, storageSet, storageRemove } from '../lib/storage'

const AuthContext = createContext(null)

const USERS_KEY = 'users' // { [username]: user }
const SESSION_KEY = 'session' // username or null

function getUsers() {
  return storageGet(USERS_KEY, {})
}
function saveUsers(users) {
  storageSet(USERS_KEY, users)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = storageGet(SESSION_KEY, null)
    if (session) {
      const users = getUsers()
      if (users[session]) setCurrentUser(users[session])
    }
    setReady(true)
  }, [])

  const login = useCallback((username, password) => {
    const uname = username.trim().toLowerCase()
    const users = getUsers()
    const user = users[uname]
    if (!user || user.password !== password) {
      return { ok: false, error: 'Username or password is incorrect.' }
    }
    setCurrentUser(user)
    storageSet(SESSION_KEY, uname)
    return { ok: true, user }
  }, [])

  const signup = useCallback(({ displayName, username, age, password }) => {
    const uname = username.trim().toLowerCase()
    if (!displayName || !uname || !age || !password) {
      return { ok: false, error: 'Please fill in every field.' }
    }
    const users = getUsers()
    if (users[uname]) {
      return { ok: false, error: "That username is taken — try another." }
    }
    const newUser = {
      username: uname,
      displayName: displayName.trim(),
      age,
      password,
      xp: 0,
      badges: [],
      completed: {},
      joined: new Date().toISOString(),
    }
    users[uname] = newUser
    saveUsers(users)
    setCurrentUser(newUser)
    storageSet(SESSION_KEY, uname)
    return { ok: true, user: newUser }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    storageRemove(SESSION_KEY)
  }, [])

  const updateAccount = useCallback(({ displayName, username, email, currentPassword, newPassword }) => {
    if (!currentUser) return { ok: false, error: 'Not logged in.' }
    if (!currentPassword || currentUser.password !== currentPassword) {
      return { ok: false, error: 'Current password is incorrect.' }
    }
    const uname = username.trim().toLowerCase()
    if (!displayName.trim() || !uname) {
      return { ok: false, error: 'Please fill in every required field.' }
    }
    if (newPassword && newPassword.length < 4) {
      return { ok: false, error: 'New password must be at least 4 characters.' }
    }
    const users = getUsers()
    if (uname !== currentUser.username && users[uname]) {
      return { ok: false, error: 'That username is taken — try another.' }
    }
    const updated = {
      ...currentUser,
      displayName: displayName.trim(),
      username: uname,
      email: email.trim(),
      password: newPassword || currentUser.password,
    }
    if (uname !== currentUser.username) {
      delete users[currentUser.username]
    }
    users[uname] = updated
    saveUsers(users)
    setCurrentUser(updated)
    storageSet(SESSION_KEY, uname)
    return { ok: true, user: updated }
  }, [currentUser])

  const saveCurrentUser = useCallback((updated) => {
    setCurrentUser(updated)
    const users = getUsers()
    users[updated.username] = updated
    saveUsers(users)
  }, [])

  const value = { currentUser, ready, login, signup, logout, saveCurrentUser, updateAccount }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

// Exposed for the admin "Users" manager, which needs to see/edit every
// account, not just the currently logged-in one.
export function getAllUsers() {
  return getUsers()
}
export function saveAllUsers(users) {
  saveUsers(users)
}
export function deleteUser(username) {
  const users = getUsers()
  delete users[username]
  saveUsers(users)
  const session = storageGet(SESSION_KEY, null)
  if (session === username) storageRemove(SESSION_KEY)
}
