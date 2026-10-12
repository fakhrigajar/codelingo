import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageGet, storageSet } from '../lib/storage'
import { DEFAULT_COURSES, DEFAULT_PATHS, DEFAULT_BADGES, DEFAULT_PAGE_TEXT } from '../data/data'

const ContentContext = createContext(null)
const CONTENT_KEY = 'local-content:v1'
const defaultContent = () => structuredClone({
  courses: DEFAULT_COURSES, paths: DEFAULT_PATHS,
  badges: DEFAULT_BADGES, pageText: DEFAULT_PAGE_TEXT,
})

function loadContent() {
  const defaults = defaultContent()
  const saved = storageGet(CONTENT_KEY)
  if (!saved) return defaults
  return {
    courses: Array.isArray(saved.courses) ? saved.courses : defaults.courses,
    paths: Array.isArray(saved.paths) ? saved.paths : defaults.paths,
    badges: Array.isArray(saved.badges) ? saved.badges : defaults.badges,
    pageText: { ...defaults.pageText, ...saved.pageText },
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)
  useEffect(() => { storageSet(CONTENT_KEY, content) }, [content])

  const addItem = useCallback((key, item) => {
    setContent((prev) => ({ ...prev, [key]: [...prev[key], item] }))
  }, [])
  const updateItem = useCallback((key, id, patch) => {
    setContent((prev) => ({ ...prev, [key]: prev[key].map((item) => item.id === id ? { ...item, ...patch } : item) }))
  }, [])
  const removeItem = useCallback((key, id) => {
    setContent((prev) => ({ ...prev, [key]: prev[key].filter((item) => item.id !== id),
      ...(key === 'courses' ? { paths: prev.paths.map((path) => ({ ...path, courseIds: path.courseIds.filter((courseId) => courseId !== id) })) } : {}),
    }))
  }, [])
  const patchLesson = useCallback((courseId, lessonId, patch) => {
    setContent((prev) => ({ ...prev, courses: prev.courses.map((course) => course.id === courseId
      ? { ...course, lessons: course.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, ...patch } : lesson) }
      : course) }))
  }, [])
  const reorderCourses = useCallback((ordered) => {
    setContent((prev) => ({ ...prev, courses: ordered.map((course, order) => ({ ...course, order })) }))
  }, [])
  const setPageText = useCallback((pageText) => {
    setContent((prev) => ({ ...prev, pageText: { ...prev.pageText, ...pageText } }))
  }, [])
  const resetToDefault = useCallback(() => setContent(defaultContent()), [])
  const exportData = useCallback(() => JSON.stringify(content, null, 2), [content])
  const importData = useCallback((json) => {
    try {
      const parsed = JSON.parse(json)
      if (!['courses', 'paths', 'badges'].every((key) => Array.isArray(parsed[key]))) {
        throw new Error('Courses, paths and badges must be arrays.')
      }
      if (!parsed.courses.every((course) => course.id && course.title && Array.isArray(course.lessons)) ||
          !parsed.paths.every((path) => path.id && path.label && Array.isArray(path.courseIds))) {
        throw new Error('Invalid course or path content.')
      }
      setContent({ courses: parsed.courses, paths: parsed.paths, badges: parsed.badges,
        pageText: { ...DEFAULT_PAGE_TEXT, ...parsed.pageText } })
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  return <ContentContext.Provider value={{ ...content, ready: true,
    addCourse: (course) => addItem('courses', course),
    updateCourse: (id, patch) => updateItem('courses', id, patch),
    removeCourse: (id) => removeItem('courses', id),
    addPath: (path) => addItem('paths', path),
    updatePath: (id, patch) => updateItem('paths', id, patch),
    removePath: (id) => removeItem('paths', id),
    addBadge: (badge) => addItem('badges', badge),
    updateBadge: (id, patch) => updateItem('badges', id, patch),
    removeBadge: (id) => removeItem('badges', id),
    patchLesson, reorderCourses, setPageText, resetToDefault, exportData, importData,
  }}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
