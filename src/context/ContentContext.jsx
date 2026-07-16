import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageGet, storageSet } from '../lib/storage'
import { createResourceSync, patchLessonFields } from '../lib/adminSync'
import { DEFAULT_BADGES, DEFAULT_PAGE_TEXT } from '../data/data'

const ContentContext = createContext(null)

// Courses, paths and badges now live entirely on the server/MongoDB (see
// server/index.js), as do community posts (see postApi.js). Only page text
// has no API yet, so it still lives here.
const CONTENT_KEY = 'content'
const coursesApi = createResourceSync('courses')
const pathsApi = createResourceSync('paths')
const badgesApi = createResourceSync('badges')

function loadInitialLocalContent() {
  const saved = storageGet(CONTENT_KEY)
  if (saved) return { pageText: DEFAULT_PAGE_TEXT, ...saved }
  return { pageText: DEFAULT_PAGE_TEXT }
}

export function ContentProvider({ children }) {
  const [local, setLocal] = useState(loadInitialLocalContent)
  const [courses, setCoursesState] = useState([])
  const [paths, setPathsState] = useState([])
  const [badges, setBadgesState] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    storageSet(CONTENT_KEY, local)
  }, [local])

  useEffect(() => {
    Promise.all([coursesApi.list(), pathsApi.list(), badgesApi.list()])
      .then(([c, p, b]) => {
        setCoursesState(c)
        setPathsState(p)
        setBadgesState(b)
      })
      .finally(() => setReady(true))
  }, [])

  const updateLocal = useCallback((updater) => {
    setLocal((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  // Single-document operations — each maps to exactly one API call for
  // exactly the course/path being touched. This matters: an earlier version
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

  // Scoped to exactly one lesson (not the whole course), for the same
  // reason updateCourse is scoped to exactly one course: a full lessons-array
  // PUT computed from a possibly-stale local copy could silently overwrite
  // an unrelated edit made to the course in the meantime.
  const patchLesson = useCallback((courseId, lessonId, patch) => {
    setCoursesState((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, lessons: c.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) }
          : c,
      ),
    )
    patchLessonFields(courseId, lessonId, patch).catch(() => {})
  }, [])

  // Stamps a fresh sequential `order` on every course to match the given
  // arrangement, so the new order survives a refresh (the server sorts
  // courses by `order`) — a plain reorder wouldn't otherwise change any
  // single course's own fields, so nothing would be diffable to persist.
  const reorderCourses = useCallback((ordered) => {
    const stamped = ordered.map((c, i) => ({ ...c, order: i }))
    setCoursesState(stamped)
    stamped.forEach((c) => {
      coursesApi.update(c.id, { order: c.order }).catch(() => {})
    })
  }, [])

  const addPath = useCallback((path) => {
    setPathsState((prev) => [...prev, path])
    pathsApi.create(path).catch(() => {})
  }, [])

  const updatePath = useCallback((id, patch) => {
    setPathsState((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    pathsApi.update(id, patch).catch(() => {})
  }, [])

  const removePath = useCallback((id) => {
    setPathsState((prev) => prev.filter((p) => p.id !== id))
    pathsApi.remove(id).catch(() => {})
  }, [])

  const addBadge = useCallback((badge) => {
    setBadgesState((prev) => [...prev, badge])
    badgesApi.create(badge).catch(() => {})
  }, [])

  const updateBadge = useCallback((id, patch) => {
    setBadgesState((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    badgesApi.update(id, patch).catch(() => {})
  }, [])

  const removeBadge = useCallback((id) => {
    setBadgesState((prev) => prev.filter((b) => b.id !== id))
    badgesApi.remove(id).catch(() => {})
  }, [])

  // Deliberate whole-collection replacements (reset to defaults, restore a
  // backup) — unlike the per-item ops above, these intentionally want to
  // make the server match a full given list, so diffing is the right call.
  const replaceCourses = useCallback((next) => {
    setCoursesState(next)
    coursesApi.replaceAll(next).catch(() => {})
  }, [])

  const replacePaths = useCallback((next) => {
    setPathsState(next)
    pathsApi.replaceAll(next).catch(() => {})
  }, [])

  const replaceBadges = useCallback((next) => {
    setBadgesState(next)
    badgesApi.replaceAll(next).catch(() => {})
  }, [])

  const setPageText = useCallback(
    (pageText) => updateLocal((prev) => ({ ...prev, pageText: { ...prev.pageText, ...pageText } })),
    [updateLocal],
  )

  // Courses, paths and badges have no hardcoded defaults to reset to
  // anymore — this only resets the locally-stored slice (page text) plus
  // badges back to the original demo set via the API.
  const resetToDefault = useCallback(() => {
    updateLocal({ pageText: DEFAULT_PAGE_TEXT })
    replaceBadges(DEFAULT_BADGES)
  }, [updateLocal, replaceBadges])

  const exportData = useCallback(
    () => JSON.stringify({ courses, paths, badges, ...local }, null, 2),
    [courses, paths, badges, local],
  )

  const importData = useCallback(
    (json) => {
      try {
        const parsed = JSON.parse(json)
        if (!parsed.courses || !parsed.badges || !parsed.paths) {
          throw new Error('Missing required keys: courses, badges, paths')
        }
        replaceCourses(parsed.courses)
        replacePaths(parsed.paths)
        replaceBadges(parsed.badges)
        updateLocal({
          pageText: { ...DEFAULT_PAGE_TEXT, ...parsed.pageText },
        })
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message }
      }
    },
    [replaceCourses, replacePaths, replaceBadges, updateLocal],
  )

  const value = {
    ...local,
    courses,
    paths,
    badges,
    ready,
    addCourse,
    updateCourse,
    removeCourse,
    patchLesson,
    reorderCourses,
    addPath,
    updatePath,
    removePath,
    addBadge,
    updateBadge,
    removeBadge,
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
