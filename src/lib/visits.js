import { readCollection, writeCollection } from './localStore'
import { uid } from './helpers'

export function logVisit({ path, referrer }) {
  try {
    const agent = navigator.userAgent
    const browser = /Edg\//.test(agent) ? 'Edge' : /Firefox\//.test(agent) ? 'Firefox' : /Chrome\//.test(agent) ? 'Chrome' : /Safari\//.test(agent) ? 'Safari' : 'Other'
    const device = /iPad|Tablet/i.test(agent) ? 'Tablet' : /Mobile/i.test(agent) ? 'Mobile' : 'Desktop'
    const os = /Android/.test(agent) ? 'Android' : /iPhone|iPad/.test(agent) ? 'iOS' : /Mac/.test(agent) ? 'macOS' : /Windows/.test(agent) ? 'Windows' : /Linux/.test(agent) ? 'Linux' : 'Other'
    writeCollection('visits', [{ id: uid('visit'), ip: 'Local browser', country: 'Unknown', city: 'Unknown',
      browser, device, os, path, referrer: referrer || 'Direct', time: Date.now() }, ...readCollection('visits')].slice(0, 500))
  } catch { /* Visit logging must not interrupt navigation. */ }
}
export async function listVisits() { return readCollection('visits') }
export async function clearVisits() { writeCollection('visits', []); return { removed: true } }
