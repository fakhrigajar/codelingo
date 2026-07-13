import { storageGet, storageSet } from './storage'
import { todayKey } from './dailyChallenges'

function key(username) {
  return `daily-challenge:${username}`
}

const DEFAULT_PROGRESS = {
  xp: 0,
  coins: 0,
  streak: 0,
  maxStreak: 0,
  lastCompletedDate: null,
  history: [], // { date, challengeId, title, language, difficulty, minutes, xp, status }
}

export const BADGES = [
  { id: 'first-challenge', icon: 'award', name: 'First Challenge', desc: 'Complete your first daily challenge.', check: (p) => p.history.length >= 1 },
  { id: 'streak-7', icon: 'flame', name: '7 Day Streak', desc: 'Reach a 7-day streak.', check: (p) => p.maxStreak >= 7 },
  { id: 'xp-1000', icon: 'zap', name: '1000 XP', desc: 'Earn 1,000 total challenge XP.', check: (p) => p.xp >= 1000 },
  { id: 'python-beginner', icon: 'code', name: 'Python Beginner', desc: 'Complete a Python challenge.', check: (p) => p.history.some((h) => h.language === 'Python') },
  { id: 'js-ninja', icon: 'braces', name: 'JS Ninja', desc: 'Complete 5 JavaScript challenges.', check: (p) => p.history.filter((h) => h.language === 'JavaScript').length >= 5 },
  { id: 'streak-30', icon: 'sparkles', name: '30 Day Streak', desc: 'Reach a 30-day streak.', check: (p) => p.maxStreak >= 30 },
  { id: 'century', icon: 'trophy', name: '100 Challenges', desc: 'Complete 100 daily challenges.', check: (p) => p.history.length >= 100 },
  { id: 'streak-365', icon: 'crown', name: '365 Day Streak', desc: 'Reach a 365-day streak.', check: (p) => p.maxStreak >= 365 },
]

export const REWARD_MILESTONES = [
  { id: 'streak-7', label: '7 Day Streak', reward: '+300 XP', check: (p) => p.maxStreak >= 7 },
  { id: 'streak-30', label: '30 Day Streak', reward: 'Exclusive Badge', check: (p) => p.maxStreak >= 30 },
  { id: 'century', label: '100 Challenges', reward: 'Legend Trophy', check: (p) => p.history.length >= 100 },
  { id: 'streak-365', label: '365 Day Streak', reward: 'CodeLingo Master', check: (p) => p.maxStreak >= 365 },
]

export function getProgress(username) {
  if (!username) return DEFAULT_PROGRESS
  return { ...DEFAULT_PROGRESS, ...storageGet(key(username), {}) }
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000)
}

export function hasCompletedToday(progress, date = new Date()) {
  return progress.lastCompletedDate === todayKey(date)
}

export function completeChallenge(username, challenge, date = new Date()) {
  const progress = getProgress(username)
  const today = todayKey(date)
  if (progress.lastCompletedDate === today) return progress // already completed

  let streak = 1
  if (progress.lastCompletedDate && daysBetween(progress.lastCompletedDate, today) === 1) {
    streak = progress.streak + 1
  }

  const updated = {
    ...progress,
    xp: progress.xp + challenge.xp,
    coins: progress.coins + challenge.coins,
    streak,
    maxStreak: Math.max(progress.maxStreak, streak),
    lastCompletedDate: today,
    history: [
      ...progress.history,
      {
        date: today,
        challengeId: challenge.id,
        title: challenge.title,
        language: challenge.language,
        difficulty: challenge.difficulty,
        minutes: challenge.minutes,
        xp: challenge.xp,
        status: 'Completed',
      },
    ],
  }

  storageSet(key(username), updated)
  return updated
}

export function getUnlockedBadges(progress) {
  return BADGES.filter((b) => b.check(progress))
}

export function getLevel(xp) {
  const XP_PER_LEVEL = 500
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const into = xp % XP_PER_LEVEL
  return { level, into, target: XP_PER_LEVEL, percent: Math.round((into / XP_PER_LEVEL) * 100) }
}

export function getWeeklyStats(progress, date = new Date()) {
  const cutoff = new Date(date)
  cutoff.setDate(cutoff.getDate() - 6)
  const cutoffKey = todayKey(cutoff)

  const recent = progress.history.filter((h) => h.date >= cutoffKey)
  const completed = recent.length
  const minutes = recent.reduce((sum, h) => sum + (h.minutes || 0), 0)
  const successRate = Math.round((completed / 7) * 100)

  return {
    completed,
    successRate: Math.min(successRate, 100),
    minutes,
    longestStreak: progress.maxStreak,
  }
}

const SYNTHETIC_LEADERBOARD = [
  { username: 'kaito_dev', displayName: 'Kaito', xp: 5240, streak: 41, level: getLevel(5240).level },
  { username: 'ada.codes', displayName: 'Ada', xp: 4310, streak: 22, level: getLevel(4310).level },
  { username: 'pixel_maria', displayName: 'Maria', xp: 3190, streak: 15, level: getLevel(3190).level },
  { username: 'devon_r', displayName: 'Devon', xp: 2470, streak: 12, level: getLevel(2470).level },
  { username: 'sana.builds', displayName: 'Sana', xp: 1860, streak: 9, level: getLevel(1860).level },
  { username: 'leo_ships_it', displayName: 'Leo', xp: 1290, streak: 6, level: getLevel(1290).level },
  { username: 'noor_k', displayName: 'Noor', xp: 780, streak: 4, level: getLevel(780).level },
  { username: 'theo.js', displayName: 'Theo', xp: 420, streak: 2, level: getLevel(420).level },
  { username: 'ivy_learns', displayName: 'Ivy', xp: 150, streak: 1, level: getLevel(150).level },
]

export function getLeaderboard(currentUser, progress) {
  const you = {
    username: currentUser.username,
    displayName: currentUser.displayName,
    xp: progress.xp,
    streak: progress.streak,
    level: getLevel(progress.xp).level,
    isYou: true,
  }

  return [...SYNTHETIC_LEADERBOARD, you]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
}

export function getMonthCalendar(progress, date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const todayStr = todayKey(date)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const completedDates = new Set(progress.history.map((h) => h.date))

  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = todayKey(new Date(year, month, d))
    const isToday = dateStr === todayStr
    const isPast = dateStr < todayStr
    const isCompleted = completedDates.has(dateStr)
    days.push({
      day: d,
      isToday,
      isCompleted,
      isMissed: isPast && !isCompleted,
    })
  }
  return { year, month, firstWeekday: new Date(year, month, 1).getDay(), days }
}
