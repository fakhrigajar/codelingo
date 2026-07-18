import { API_BASE } from './apiBase'

// Best-effort — a failed or slow visit log must never block/break navigation,
// so this never throws and the caller doesn't need to await it.
export function logVisit({ path, referrer }) {
  fetch(`${API_BASE}/api/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, referrer }),
    keepalive: true,
  }).catch(() => {})
}

export async function listVisits() {
  const res = await fetch(`${API_BASE}/api/visits`)
  if (!res.ok) throw new Error('Could not load visitors.')
  return res.json()
}

export async function clearVisits() {
  const res = await fetch(`${API_BASE}/api/visits`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not clear visitors.')
  return res.json()
}
