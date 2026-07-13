// A course's lessons are grouped into "units". Newer courses carry an
// explicit, ordered `course.units: [{ number, title }]` list — including
// units the admin created but hasn't added a lesson to yet. Older courses
// saved before units were a first-class concept only have `unit`/`unitTitle`
// on each lesson, so we derive an equivalent list from those instead.
export function getCourseUnits(course) {
  if (Array.isArray(course.units)) return course.units
  const units = []
  const seen = new Set()
  for (const lesson of course.lessons) {
    if (lesson.unit == null || seen.has(lesson.unit)) continue
    seen.add(lesson.unit)
    units.push({ number: lesson.unit, title: lesson.unitTitle })
  }
  return units
}

// Groups every lesson under its unit, in unit-list order. Lessons whose
// `unit` doesn't match any known unit (or has none) fall into a trailing
// "Unsorted lessons" pseudo-group rather than being silently dropped.
export function groupLessonsByUnit(course) {
  const units = getCourseUnits(course)
  const groups = units.map((u) => ({ ...u, items: [] }))
  const byNumber = new Map(groups.map((g) => [g.number, g]))
  const unsorted = []
  for (const lesson of course.lessons) {
    const group = byNumber.get(lesson.unit)
    if (group) group.items.push(lesson)
    else unsorted.push(lesson)
  }
  if (unsorted.length) groups.push({ number: null, title: 'Unsorted lessons', items: unsorted })
  return groups
}

// Shared id convention for a unit's droppable lesson-list container, so the
// admin editor and its drag handlers always agree on the same string.
export function unitContainerId(number) {
  return `unit-drop-${number ?? 'unsorted'}`
}

export function nextUnitNumber(units) {
  const nums = units.map((u) => u.number).filter((n) => typeof n === 'number')
  return nums.length ? Math.max(...nums) + 1 : 1
}

// Recomputes each lesson's unitTitle (from the current units list) and its
// "1.1"/"1.2"-style subUnit label (from its position within its unit) — call
// this after any add/move/reorder so both stay in sync with reality.
export function applyUnitsToLessons(lessons, units) {
  const titleByNumber = new Map(units.map((u) => [u.number, u.title]))
  const seenByUnit = {}
  return lessons.map((l) => {
    if (l.unit == null) return l
    seenByUnit[l.unit] = (seenByUnit[l.unit] || 0) + 1
    return {
      ...l,
      unitTitle: titleByNumber.get(l.unit) ?? l.unitTitle,
      subUnit: `${l.unit}.${seenByUnit[l.unit]}`,
    }
  })
}
