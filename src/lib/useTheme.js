import { useEffect, useState } from 'react'
import { storageGet, storageSet } from './storage'

const THEME_EVENT = 'codelingo:theme-change'

function getInitialTheme() {
  const stored = storageGet('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    storageSet('theme', theme)
  }, [theme])

  // More than one component can call useTheme() at once (e.g. the navbar
  // toggle and the settings page switch) — each holds its own state, so
  // without this they'd drift out of sync until a full remount.
  useEffect(() => {
    const handleExternalChange = (e) => setTheme(e.detail)
    window.addEventListener(THEME_EVENT, handleExternalChange)
    return () => window.removeEventListener(THEME_EVENT, handleExternalChange)
  }, [])

  const setThemeShared = (next) => {
    setTheme(next)
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }))
  }

  const toggleTheme = () => setThemeShared(theme === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme, setTheme: setThemeShared }
}
