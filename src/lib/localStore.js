import { storageGet, storageSet } from './storage'

export function readCollection(name, defaults = []) {
  const key = `local:${name}:v1`
  const saved = storageGet(key)
  if (Array.isArray(saved)) return saved
  const initial = structuredClone(defaults)
  storageSet(key, initial)
  return initial
}

export function writeCollection(name, items) {
  if (!storageSet(`local:${name}:v1`, items)) {
    throw new Error('Browser storage is full or unavailable. Remove large attachments and try again.')
  }
  return items
}

export function createLocalCollection(name, idField = 'id', defaults = []) {
  const read = () => readCollection(name, defaults)
  return {
    list: async () => read(),
    async get(id) {
      const item = read().find((entry) => entry[idField] === id)
      if (!item) throw Object.assign(new Error('Item not found.'), { status: 404 })
      return item
    },
    async create(item) {
      const items = read()
      if (items.some((entry) => entry[idField] === item[idField])) {
        throw new Error('That identifier is already in use.')
      }
      writeCollection(name, [...items, item])
      return item
    },
    async update(id, patch) {
      const items = read()
      const previous = items.find((entry) => entry[idField] === id)
      if (!previous) throw new Error('Item not found.')
      const updated = { ...previous, ...patch, [idField]: id }
      writeCollection(name, items.map((entry) => entry[idField] === id ? updated : entry))
      return updated
    },
    async remove(id) {
      writeCollection(name, read().filter((entry) => entry[idField] !== id))
      return { removed: true }
    },
  }
}
