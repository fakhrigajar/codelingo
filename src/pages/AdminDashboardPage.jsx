import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { getAllUsers } from '../context/AuthContext'
import { listAllMessages } from '../lib/chatApi'
import AdminCard from '../components/admin/AdminCard'

export default function AdminDashboardPage() {
  const { courses, badges, grades, rooms } = useContent()
  const [users, setUsers] = useState([])
  const [totalMessages, setTotalMessages] = useState(0)

  useEffect(() => {
    getAllUsers().then(setUsers)
    listAllMessages().then((msgs) => setTotalMessages(msgs.length))
  }, [])

  const totalLessons = courses.reduce((a, c) => a + c.lessons.length, 0)

  const stats = [
    { label: 'Courses', value: courses.length },
    { label: 'Lessons & quizzes', value: totalLessons },
    { label: 'Grades', value: grades.length },
    { label: 'Badges', value: badges.length },
    { label: 'Chat rooms', value: rooms.length },
    { label: 'Registered learners', value: users.length },
    { label: 'Chat messages sent', value: totalMessages },
  ]

  return (
    <div>
      <h1 className="text-2xl mb-1">Dashboard</h1>
      <p className="text-ink-soft mb-6">A quick look at everything living inside CodeLingo right now.</p>
      <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-4">
        {stats.map((s) => (
          <AdminCard key={s.label}>
            <b className="block font-mono text-2xl text-indigo-dark">{s.value}</b>
            <span className="text-[.85rem] text-ink-soft">{s.label}</span>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="Getting around" className="mt-6">
        <ul className="list-disc pl-5 text-[.92rem] text-ink-soft space-y-1.5">
          <li><strong className="text-ink">Grades</strong> — edit the section header, age range and roadmap topics kids see on the Grades page.</li>
          <li><strong className="text-ink">Courses</strong> — edit course info and every lesson or quiz inside it.</li>
          <li><strong className="text-ink">Badges</strong> — change what badges look like and what they're called.</li>
          <li><strong className="text-ink">Chat rooms</strong> — rename rooms or wipe a room's message history.</li>
          <li><strong className="text-ink">Users</strong> — view registered learners, reset their progress, or remove an account.</li>
          <li><strong className="text-ink">Backup & reset</strong> — export everything to a file, restore from a file, or reset to the original demo content.</li>
        </ul>
      </AdminCard>
    </div>
  )
}
