import { DEFAULT_RESUME_REVIEW } from '../data/toolDefaults'

export async function reviewResume({ resumeText }) {
  if (!resumeText.trim()) throw new Error('Upload a CV to view the sample feedback.')
  return structuredClone(DEFAULT_RESUME_REVIEW)
}
