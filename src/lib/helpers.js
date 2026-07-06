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

export function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v)
  const R = clamp((num >> 16) + amt)
  const G = clamp(((num >> 8) & 0x00ff) + amt)
  const B = clamp((num & 0x0000ff) + amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
