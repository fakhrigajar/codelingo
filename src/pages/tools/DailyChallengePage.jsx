import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getTodayChallenge } from '../../lib/dailyChallenges'
import {
  getProgress,
  hasCompletedToday,
  completeChallenge,
  getUnlockedBadges,
  getLevel,
  getWeeklyStats,
  getLeaderboard,
  getMonthCalendar,
} from '../../lib/dailyChallengeProgress'

import HeroCard from '../../components/daily-challenge/HeroCard'
import TodayChallengeCard from '../../components/daily-challenge/TodayChallengeCard'
import ProgressStats from '../../components/daily-challenge/ProgressStats'
import StreakCalendar from '../../components/daily-challenge/StreakCalendar'
import AchievementBadges from '../../components/daily-challenge/AchievementBadges'
import LeaderboardTable from '../../components/daily-challenge/LeaderboardTable'
import ChallengeHistoryTable from '../../components/daily-challenge/ChallengeHistoryTable'
import WeeklyStats from '../../components/daily-challenge/WeeklyStats'
import RewardsTimeline from '../../components/daily-challenge/RewardsTimeline'
import MotivationBanner from '../../components/daily-challenge/MotivationBanner'
import Confetti from '../../components/daily-challenge/Confetti'

export default function DailyChallengePage() {
  const { currentUser } = useAuth()
  const challenge = useMemo(() => getTodayChallenge(), [])
  const challengeSectionRef = useRef(null)

  const [progress, setProgress] = useState(() => getProgress(currentUser.username))
  const [status, setStatus] = useState(() =>
    hasCompletedToday(getProgress(currentUser.username)) ? 'completed' : 'idle',
  )
  const [confettiTrigger, setConfettiTrigger] = useState(0)

  const level = getLevel(progress.xp)
  const weeklyStats = getWeeklyStats(progress)
  const leaderboard = getLeaderboard(currentUser, progress)
  const calendar = getMonthCalendar(progress)
  const unlockedIds = useMemo(() => new Set(getUnlockedBadges(progress).map((b) => b.id)), [progress])
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  const scrollToChallenge = () => {
    challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleStart = () => {
    if (status === 'idle') setStatus('started')
    scrollToChallenge()
  }

  const handleComplete = () => {
    const updated = completeChallenge(currentUser.username, challenge)
    setProgress(updated)
    setStatus('completed')
    setConfettiTrigger((t) => t + 1)
  }

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <Link to="/tools" className="hover:text-violet dark:hover:text-violet">
          Tools
        </Link>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">Daily Challenge</span>
      </nav>

      <div className="flex flex-col gap-6">
        <HeroCard
          streak={progress.streak}
          todayXp={challenge.xp}
          todayCoins={challenge.coins}
          completedToday={status === 'completed'}
          onStart={handleStart}
        />

        <TodayChallengeCard
          sectionRef={challengeSectionRef}
          challenge={challenge}
          status={status}
          onStart={handleStart}
          onComplete={handleComplete}
        />

        <ProgressStats xp={progress.xp} level={level} />

        <StreakCalendar
          days={calendar.days}
          firstWeekday={calendar.firstWeekday}
          monthLabel={monthLabel}
          streak={progress.streak}
        />

        <AchievementBadges unlockedIds={unlockedIds} />

        <LeaderboardTable entries={leaderboard} currentUser={currentUser} />

        <ChallengeHistoryTable history={progress.history} />

        <WeeklyStats stats={weeklyStats} />

        <RewardsTimeline progress={progress} />

        <MotivationBanner />
      </div>

      <Confetti trigger={confettiTrigger} />
    </div>
  )
}
