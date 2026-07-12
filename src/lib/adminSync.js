import { API_BASE } from './apiBase'

// Client for the server's /api/courses, /api/grades and /api/users routes —
// these are now the actual data store for the app (no localStorage fallback).
async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status}).`)
  return data
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
