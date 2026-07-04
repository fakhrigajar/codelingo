// Small localStorage wrapper. Everything is namespaced under "ictquest:"
// so the app never collides with anything else living in localStorage.

const PREFIX = 'ictquest:'

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.error('storageGet failed', key, e)
    return fallback
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error('storageSet failed', key, e)
    return false
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
    return true
  } catch (e) {
    console.error('storageRemove failed', key, e)
    return false
  }
}

// List all keys (without the app prefix) that start with the given prefix.
export function storageList(prefix = '') {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i)
    if (fullKey && fullKey.startsWith(PREFIX + prefix)) {
      keys.push(fullKey.slice(PREFIX.length))
    }
  }
  return keys
}
