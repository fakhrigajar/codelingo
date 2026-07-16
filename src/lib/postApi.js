import { API_BASE } from './apiBase'

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

export const listPosts = () => request('GET', '/api/posts')
export const createPost = (post) => request('POST', '/api/posts', post)
// requestedBy is checked server-side (owner or admin only) — the server is
// the actual gate, this isn't just a client-side courtesy.
export const removePost = (id, requestedBy) =>
  request('DELETE', `/api/posts/${encodeURIComponent(id)}?requestedBy=${encodeURIComponent(requestedBy)}`)
export const listPostDeletions = () => request('GET', '/api/post-deletions')
export const likePost = (id, username) =>
  request('POST', `/api/posts/${encodeURIComponent(id)}/like`, { username })
export const reportPost = (id, username, reason) =>
  request('POST', `/api/posts/${encodeURIComponent(id)}/report`, { username, reason })
export const replyToPost = (id, reply) =>
  request('POST', `/api/posts/${encodeURIComponent(id)}/replies`, reply)
export const likeReply = (postId, replyId, username) =>
  request(
    'POST',
    `/api/posts/${encodeURIComponent(postId)}/replies/${encodeURIComponent(replyId)}/like`,
    { username },
  )
