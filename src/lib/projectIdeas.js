import { API_BASE } from './apiBase'

export async function generateProjectIdeas({ language, level, detailed }) {
  let res
  try {
    res = await fetch(`${API_BASE}/api/project-ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, level, detailed }),
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
  return data.ideas
}
