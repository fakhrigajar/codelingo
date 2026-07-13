import { API_BASE } from './apiBase'

function discussionsUrl(courseId, lessonId) {
  return `${API_BASE}/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/discussions`
}

export async function listComments(courseId, lessonId) {
  const res = await fetch(discussionsUrl(courseId, lessonId))
  if (!res.ok) throw new Error(`Could not load comments (${res.status}).`)
  return res.json()
}

export async function postComment(courseId, lessonId, comment) {
  const res = await fetch(discussionsUrl(courseId, lessonId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Could not post comment (${res.status}).`)
  return data
}
