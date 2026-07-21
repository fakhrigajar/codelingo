import { UPLOADS_BASE } from './apiBase'

// Shared upload endpoint for both images and documents — returns the mime
// type too so callers (e.g. the community composer) can tell attachments
// apart without re-deriving it from the file extension.
export async function uploadFile(dataUrl, filename) {
  const res = await fetch(`${UPLOADS_BASE}/api/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl, filename }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status}).`)
  return data
}
