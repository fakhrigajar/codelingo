import { API_BASE } from './apiBase'

export async function listRoomMessages(roomId) {
  const res = await fetch(`${API_BASE}/api/messages/${encodeURIComponent(roomId)}`)
  if (!res.ok) throw new Error(`Could not load messages (${res.status}).`)
  return res.json()
}

export async function listAllMessages() {
  const res = await fetch(`${API_BASE}/api/messages`)
  if (!res.ok) throw new Error(`Could not load messages (${res.status}).`)
  return res.json()
}

export async function postMessage(roomId, message) {
  const res = await fetch(`${API_BASE}/api/messages/${encodeURIComponent(roomId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Could not send message (${res.status}).`)
  return data
}

export async function clearRoomMessages(roomId) {
  const res = await fetch(`${API_BASE}/api/messages/${encodeURIComponent(roomId)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Could not clear messages (${res.status}).`)
  return res.json()
}
