import { DEFAULT_INTERVIEW_QUESTIONS } from '../data/toolDefaults'
import { DEFAULT_COURSES } from '../data/data'
import { generateCourseQuiz } from './courseQuiz'

export async function generateInterviewQuestions({ role, count = 8 }) {
  const topic = role.toLowerCase()
  const ids = /frontend|react|javascript|typescript/.test(topic) ? ['javascript', 'typescript', 'react']
    : /backend|node/.test(topic) ? ['nodejs', 'sql', 'git']
    : /data|python|sql/.test(topic) ? ['python', 'sql'] : []
  const questions = (await Promise.all(DEFAULT_COURSES.filter((course) => ids.includes(course.id))
    .map((course) => generateCourseQuiz({ course })))).flat()
  return structuredClone([...questions, ...DEFAULT_INTERVIEW_QUESTIONS].slice(0, count))
}
