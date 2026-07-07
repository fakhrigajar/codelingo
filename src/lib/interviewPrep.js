import { API_BASE } from './apiBase'

export async function generateInterviewQuestions({ role, count = 8 }) {
  let res
  try {
    res = await fetch(`${API_BASE}/api/interview-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, count }),
    })
  } catch {
    throw new Error(
      'Could not reach the AI analysis server — make sure it is running (npm run server, or npm run dev:all).',
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status}).`)
  }
  return data.questions
}
