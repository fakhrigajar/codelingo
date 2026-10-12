import { DEFAULT_COURSES, DEFAULT_PATHS } from '../data/data'

export async function generateLearningPath({ experience, goal }) {
  const target = goal.toLowerCase()
  const pathId = /python|data/.test(target) ? 'python-data' : /full.?stack|backend|node/.test(target) ? 'full-stack'
    : /react|frontend|front.end/.test(target) ? 'frontend' : 'web-foundations'
  const path = DEFAULT_PATHS.find((entry) => entry.id === pathId)
  const courses = path.courseIds.map((id) => DEFAULT_COURSES.find((course) => course.id === id))
  return [...courses.map((course) => ({ title: course.title, description: course.about })),
    { title: 'Build a practice project', description: `Apply these courses to a ${experience === 'Advanced' ? 'larger' : 'small'} project, document your decisions and review what you learned.` }]
}
