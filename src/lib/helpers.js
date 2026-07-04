export function initials(name) {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function courseById(courses, id) {
  return courses.find((c) => c.id === id)
}

export function lessonById(course, id) {
  return course ? course.lessons.find((l) => l.id === id) : null
}

export function completedCount(user, course) {
  return ((user && user.completed && user.completed[course.id]) || []).length
}

export function progressPct(user, course) {
  if (!user || !course.lessons.length) return 0
  return Math.round((completedCount(user, course) / course.lessons.length) * 100)
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
