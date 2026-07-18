import { API_BASE } from './apiBase'

// Uploaded files (avatars, banners, post images/documents, lesson images)
// are always served from this server's /uploads/*. A record can have been
// saved with a full URL baked in from whatever host handled the original
// upload (e.g. a developer's own localhost during testing) — that breaks
// the moment it's viewed from a different device or domain, showing up as
// a broken-image icon. Normalizing to just the /uploads/... path and
// re-prefixing with the *current* API_BASE means it always resolves to
// wherever this app is actually talking to, no matter where it was uploaded.
export function resolveUploadUrl(url) {
  if (!url) return url
  const idx = url.indexOf('/uploads/')
  if (idx === -1) return url
  return `${API_BASE}${url.slice(idx)}`
}
