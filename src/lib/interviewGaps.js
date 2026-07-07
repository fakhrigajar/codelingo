import { storageGet, storageSet } from './storage'

const MAX_GAPS = 500

function key(username) {
  return `interview-gaps:${username}`
}

// Records a missed interview question as a knowledge gap, tagged by its
// short topic (e.g. "React Hooks") so repeated misses on the same concept
// group together instead of listing every question verbatim.
export function recordGap(username, { title, question, role }) {
  if (!username || !title) return
  const gaps = storageGet(key(username), [])
  gaps.push({ title, question, role, time: Date.now() })
  storageSet(key(username), gaps.slice(-MAX_GAPS))
}

// Aggregates recorded gaps into unique topics, ranked by how often they
// were missed (then by recency), for display on the profile page. Every
// distinct topic ever missed is kept — no cap — so practicing a new topic
// never pushes older gaps out of view.
export function getSignificantGaps(username, limit = Infinity) {
  if (!username) return []
  const gaps = storageGet(key(username), [])
  const byTitle = new Map()
  for (const g of gaps) {
    const existing = byTitle.get(g.title)
    if (existing) {
      existing.count += 1
      existing.lastTime = Math.max(existing.lastTime, g.time)
    } else {
      byTitle.set(g.title, { title: g.title, count: 1, lastTime: g.time })
    }
  }
  return [...byTitle.values()]
    .sort((a, b) => b.count - a.count || b.lastTime - a.lastTime)
    .slice(0, limit)
}
