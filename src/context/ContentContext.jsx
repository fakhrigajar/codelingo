import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageGet, storageSet } from '../lib/storage'
import { DEFAULT_COURSES, DEFAULT_BADGES, DEFAULT_GRADES, DEFAULT_ROOMS, DEFAULT_PAGE_TEXT } from '../data/data'

const ContentContext = createContext(null)

const CONTENT_KEY = 'content'

function loadInitialContent() {
  const saved = storageGet(CONTENT_KEY)
  if (saved) return { pageText: DEFAULT_PAGE_TEXT, ...saved }
  return {
    courses: DEFAULT_COURSES,
    badges: DEFAULT_BADGES,
    grades: DEFAULT_GRADES,
    rooms: DEFAULT_ROOMS,
    pageText: DEFAULT_PAGE_TEXT,
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadInitialContent)

  useEffect(() => {
    storageSet(CONTENT_KEY, content)
  }, [content])

  const update = useCallback((updater) => {
    setContent((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const setCourses = useCallback((courses) => update((prev) => ({ ...prev, courses })), [update])
  const setBadges = useCallback((badges) => update((prev) => ({ ...prev, badges })), [update])
  const setGrades = useCallback((grades) => update((prev) => ({ ...prev, grades })), [update])
  const setRooms = useCallback((rooms) => update((prev) => ({ ...prev, rooms })), [update])
  const setPageText = useCallback((pageText) => update((prev) => ({ ...prev, pageText: { ...prev.pageText, ...pageText } })), [update])

  const resetToDefault = useCallback(() => {
    const fresh = {
      courses: DEFAULT_COURSES,
      badges: DEFAULT_BADGES,
      grades: DEFAULT_GRADES,
      rooms: DEFAULT_ROOMS,
      pageText: DEFAULT_PAGE_TEXT,
    }
    setContent(fresh)
  }, [])

  const exportData = useCallback(() => JSON.stringify(content, null, 2), [content])

  const importData = useCallback((json) => {
    try {
      const parsed = JSON.parse(json)
      if (!parsed.courses || !parsed.badges || !parsed.grades || !parsed.rooms) {
        throw new Error('Missing required keys: courses, badges, grades, rooms')
      }
      setContent(parsed)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [])

  const value = {
    ...content,
    setCourses,
    setBadges,
    setGrades,
    setRooms,
    setPageText,
    resetToDefault,
    exportData,
    importData,
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
