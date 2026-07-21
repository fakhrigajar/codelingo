import { UPLOADS_BASE } from './apiBase'

export async function uploadImage(dataUrl) {
  const res = await fetch(`${UPLOADS_BASE}/api/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status}).`)
  return data.url
}
