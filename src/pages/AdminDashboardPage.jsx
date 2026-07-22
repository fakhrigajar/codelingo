import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { getAllUsers } from '../context/AuthContext'
import { listPosts } from '../lib/postApi'
import { listVisits } from '../lib/visitApi'
import AdminCard from '../components/admin/AdminCard'
import CategoryBarChart from '../components/admin/charts/CategoryBarChart'
import VisitsTrendChart from '../components/admin/charts/VisitsTrendChart'
import { CHART_SEQUENTIAL } from '../lib/chartColors'
import FadeIn from '../components/common/FadeIn'
import {
  getDailyVisitCounts,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getOsBreakdown,
  getTopPages,
  getUniqueVisitorCount,
  getTodayCount,
  getTopCountry,
} from '../lib/visitStats'

export default function AdminDashboardPage() {
  const { courses, badges, paths } = useContent()
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [visits, setVisits] = useState([])

  useEffect(() => {
    getAllUsers().then(setUsers)
    listPosts().then(setPosts)
    listVisits().then(setVisits)
  }, [])

  const totalLessons = courses.reduce((a, c) => a + c.lessons.length, 0)
  const reportedPosts = posts.filter((p) => (p.reports || []).length > 0).length

  const stats = [
    { label: 'Courses', value: courses.length },
    { label: 'Lessons & quizzes', value: totalLessons },
    { label: 'Paths', value: paths.length },
    { label: 'Badges', value: badges.length },
    { label: 'Registered learners', value: users.length },
    { label: 'Community posts', value: posts.length },
    { label: 'Reported posts', value: reportedPosts },
  ]

  const visitorStats = [
    { label: 'Total visits', value: visits.length },
    { label: 'Visits today', value: getTodayCount(visits) },
    { label: 'Unique visitors', value: getUniqueVisitorCount(visits) },
    { label: 'Top country', value: getTopCountry(visits) },
  ]

  const topPages = getTopPages(visits).map((p) => ({ ...p, color: CHART_SEQUENTIAL }))

  return (
    <div>
      <FadeIn delay={0.05}>
        <h1 className="text-2xl mb-1">Dashboard</h1>
        <p className="text-ink-soft dark:text-white/60 mb-6">A quick look at everything living inside CodeLingo right now.</p>
      </FadeIn>
      <FadeIn delay={0.15} className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={Math.min(0.2 + i * 0.05, 0.4)}>
            <AdminCard>
              <b className="block font-mono text-2xl text-indigo-dark dark:text-white">{s.value}</b>
              <span className="text-[.85rem] text-ink-soft dark:text-white/60">{s.label}</span>
            </AdminCard>
          </FadeIn>
        ))}
      </FadeIn>

      <FadeIn delay={0.25}>
        <h2 className="text-xl mt-8 mb-1">Visitors</h2>
        <p className="text-ink-soft dark:text-white/60 mb-4">Traffic to the public site, from the visitor log.</p>

        <div className="grid sm:grid-cols-2 desktop:grid-cols-4 gap-4 mb-4">
          {visitorStats.map((s, i) => (
            <FadeIn key={s.label} delay={Math.min(0.3 + i * 0.05, 0.4)}>
              <AdminCard>
                <b className="block font-mono text-2xl text-indigo-dark dark:text-white truncate">{s.value}</b>
                <span className="text-[.85rem] text-ink-soft dark:text-white/60">{s.label}</span>
              </AdminCard>
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.35} className="grid desktop:grid-cols-2 gap-4">
        <AdminCard title="Visits over time" className="desktop:col-span-2">
          <VisitsTrendChart data={getDailyVisitCounts(visits)} />
        </AdminCard>
        <AdminCard title="Devices">
          <CategoryBarChart data={getDeviceBreakdown(visits)} />
        </AdminCard>
        <AdminCard title="Browsers">
          <CategoryBarChart data={getBrowserBreakdown(visits)} />
        </AdminCard>
        <AdminCard title="Operating systems">
          <CategoryBarChart data={getOsBreakdown(visits)} />
        </AdminCard>
        <AdminCard title="Top pages">
          <CategoryBarChart data={topPages} labelWidth={160} />
        </AdminCard>
      </FadeIn>

      <FadeIn delay={0.35}>
        <AdminCard title="Getting around" className="mt-6">
          <ul className="list-disc pl-5 text-[.92rem] text-ink-soft dark:text-white/60 space-y-1.5">
            <li><strong className="text-ink dark:text-white">Paths</strong> — edit the section header and each path's ordered list of courses kids see on the Paths page.</li>
            <li><strong className="text-ink dark:text-white">Courses</strong> — edit course info and every lesson or quiz inside it.</li>
            <li><strong className="text-ink dark:text-white">Badges</strong> — change what badges look like and what they're called.</li>
            <li><strong className="text-ink dark:text-white">Community posts</strong> — browse every post, review what's been reported, and delete anything that breaks the rules.</li>
            <li><strong className="text-ink dark:text-white">Users</strong> — view registered learners and the visitor log, reset progress, or remove an account.</li>
            <li><strong className="text-ink dark:text-white">System</strong> — export/restore content, reset to defaults, or look up an API route.</li>
          </ul>
        </AdminCard>
      </FadeIn>
    </div>
  )
}
