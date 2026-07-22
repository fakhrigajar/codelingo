import { API_BASE } from './apiBase'

// Client for the server's /api/courses, /api/paths and /api/users routes —
// these are now the actual data store for the app (no localStorage fallback).
async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Lets a request started right as the tab is closing/backgrounding
    // (e.g. flushing video watch-time on pagehide) still complete instead
    // of being cancelled mid-flight.
    keepalive: true,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status}).`)
    err.status = res.status
    throw err
  }
  return data
}

// Patches fields on a single lesson nested inside a course, atomically on
// the server (a MongoDB positional update) rather than reading the whole
// course, editing it locally and PUTing it all back — that read-modify-write
// pattern would silently clobber any other change made to the course between
// the read and the write (e.g. an admin editing it in another tab).
export function patchLessonFields(courseId, lessonId, patch) {
  return request(
    'PATCH',
    `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`,
    patch,
  )
}

export function createResourceSync(resource, idField = 'id') {
  const base = `/api/${resource}`
  return {
    list: () => request('GET', base),
    get: (id) => request('GET', `${base}/${encodeURIComponent(id)}`),
    create: (item) => request('POST', base, item),
    update: (id, item) => request('PUT', `${base}/${encodeURIComponent(id)}`, item),
    remove: (id) => request('DELETE', `${base}/${encodeURIComponent(id)}`),
    removeAll: () => request('DELETE', base),
    // Makes the server's list match nextList: upserts only items that are new
    // or actually changed, then deletes whatever isn't in nextList anymore.
    // Diffing (rather than always PUTing everything) matters here since a
    // single-field edit to one course shouldn't re-send all thirty of them.
    async replaceAll(nextList) {
      const prevList = await request('GET', base)
      const prevById = new Map(prevList.map((item) => [item[idField], item]))
      const nextIds = new Set(nextList.map((item) => item[idField]))
      const changed = nextList.filter((item) => JSON.stringify(prevById.get(item[idField])) !== JSON.stringify(item))
      const removed = prevList.filter((item) => !nextIds.has(item[idField]))
      await Promise.all([
        ...changed.map((item) => request('PUT', `${base}/${encodeURIComponent(item[idField])}`, item)),
        ...removed.map((item) => request('DELETE', `${base}/${encodeURIComponent(item[idField])}`)),
      ])
      return nextList
    },
  }
}
