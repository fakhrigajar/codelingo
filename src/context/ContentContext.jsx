import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageGet, storageSet } from '../lib/storage'
import { createResourceSync } from '../lib/adminSync'
import { DEFAULT_BADGES, DEFAULT_ROOMS, DEFAULT_PAGE_TEXT } from '../data/data'

const ContentContext = createContext(null)

// Courses and grades now live entirely on the server/MongoDB (see
// server/index.js) — there are no hardcoded defaults for them anymore.
// Badges, rooms and page text have no API yet, so they still live here.
const CONTENT_KEY = 'content'
const coursesApi = createResourceSync('courses')
const gradesApi = createResourceSync('grades')

function loadInitialLocalContent() {
  const saved = storageGet(CONTENT_KEY)
  if (saved) return { pageText: DEFAULT_PAGE_TEXT, ...saved }
  return { badges: DEFAULT_BADGES, rooms: DEFAULT_ROOMS, pageText: DEFAULT_PAGE_TEXT }
}

export function ContentProvider({ children }) {
  const [local, setLocal] = useState(loadInitialLocalContent)
  const [courses, setCoursesState] = useState([])
  const [grades, setGradesState] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    storageSet(CONTENT_KEY, local)
  }, [local])

  useEffect(() => {
    Promise.all([coursesApi.list(), gradesApi.list()])
      .then(([c, g]) => {
        setCoursesState(c)
        setGradesState(g)
      })
      .finally(() => setReady(true))
  }, [])

  const updateLocal = useCallback((updater) => {
    setLocal((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  // Single-document operations — each maps to exactly one API call for
  // exactly the course/grade being touched. This matters: an earlier version
  // synced the *entire* array on every edit (diffing the browser's copy
  // against the server and deleting anything missing), which silently wiped
  // out unrelated courses whenever the local copy was ever stale — e.g. two
  // tabs open, or a slow reload. Scoping every action to its own id makes
  // that class of bug impossible.
  const addCourse = useCallback((course) => {
    setCoursesState((prev) => [...prev, course])
    coursesApi.create(course).catch(() => {})
  }, [])

  const updateCourse = useCallback((id, patch) => {
    setCoursesState((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    coursesApi.update(id, patch).catch(() => {})
  }, [])

  const removeCourse = useCallback((id) => {
    setCoursesState((prev) => prev.filter((c) => c.id !== id))
    coursesApi.remove(id).catch(() => {})
  }, [])

  const addGrade = useCallback((grade) => {
    setGradesState((prev) => [...prev, grade])
    gradesApi.create(grade).catch(() => {})
  }, [])

  const updateGrade = useCallback((id, patch) => {
    setGradesState((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
    gradesApi.update(id, patch).catch(() => {})
  }, [])

  const removeGrade = useCallback((id) => {
    setGradesState((prev) => prev.filter((g) => g.id !== id))
    gradesApi.remove(id).catch(() => {})
  }, [])

  // Deliberate whole-collection replacements (reset to defaults, restore a
  // backup) — unlike the per-item ops above, these intentionally want to
  // make the server match a full given list, so diffing is the right call.
  const replaceCourses = useCallback((next) => {
    setCoursesState(next)
    coursesApi.replaceAll(next).catch(() => {})
  }, [])

  const replaceGrades = useCallback((next) => {
    setGradesState(next)
    gradesApi.replaceAll(next).catch(() => {})
  }, [])

  const setBadges = useCallback((badges) => updateLocal((prev) => ({ ...prev, badges })), [updateLocal])
  const setRooms = useCallback((rooms) => updateLocal((prev) => ({ ...prev, rooms })), [updateLocal])
  const setPageText = useCallback(
    (pageText) => updateLocal((prev) => ({ ...prev, pageText: { ...prev.pageText, ...pageText } })),
    [updateLocal],
  )

  // Courses and grades have no hardcoded defaults to reset to anymore — this
  // only resets the locally-stored slice (badges, rooms, page text).
  const resetToDefault = useCallback(() => {
    updateLocal({ badges: DEFAULT_BADGES, rooms: DEFAULT_ROOMS, pageText: DEFAULT_PAGE_TEXT })
  }, [updateLocal])

  const exportData = useCallback(
    () => JSON.stringify({ courses, grades, ...local }, null, 2),
    [courses, grades, local],
  )

  const importData = useCallback(
    (json) => {
      try {
        const parsed = JSON.parse(json)
        if (!parsed.courses || !parsed.badges || !parsed.grades || !parsed.rooms) {
          throw new Error('Missing required keys: courses, badges, grades, rooms')
        }
        replaceCourses(parsed.courses)
        replaceGrades(parsed.grades)
        updateLocal({
          badges: parsed.badges,
          rooms: parsed.rooms,
          pageText: { ...DEFAULT_PAGE_TEXT, ...parsed.pageText },
        })
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message }
      }
    },
    [replaceCourses, replaceGrades, updateLocal],
  )

  const value = {
    ...local,
    courses,
    grades,
    ready,
    addCourse,
    updateCourse,
    removeCourse,
    addGrade,
    updateGrade,
    removeGrade,
    setBadges,
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
