import { API_BASE } from './apiBase'

export function fetchPublicUsers() {
  return fetch(`${API_BASE}/api/users-public`).then((res) => {
    if (!res.ok) throw new Error('Could not load users.')
    return res.json()
  })
}
