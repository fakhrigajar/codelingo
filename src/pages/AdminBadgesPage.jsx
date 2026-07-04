import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import AdminCard from '../components/admin/AdminCard'
import { AdminInput, AdminTextarea, AdminButton } from '../components/admin/AdminFields'

export default function AdminBadgesPage() {
  const { badges, setBadges } = useContent()
  const toast = useToast()

  const updateBadge = (id, patch) => {
    setBadges(badges.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const removeBadge = (id) => {
    if (!confirm('Delete this badge? Learners who already earned it will keep the id, but it will stop showing up.')) return
    setBadges(badges.filter((b) => b.id !== id))
    toast('Badge deleted')
  }

  const addBadge = () => {
    setBadges([...badges, { id: uid('badge'), icon: '⭐', name: 'New Badge', desc: 'Describe how to earn this.' }])
    toast('Badge added')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h1 className="text-2xl m-0">Badges</h1>
        <AdminButton onClick={addBadge}>+ Add badge</AdminButton>
      </div>
      <p className="text-ink-soft mb-6">Change the icon, name and description shown on learner profiles.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {badges.map((b) => (
          <AdminCard key={b.id}>
            <div className="grid grid-cols-[70px_1fr] gap-3">
              <AdminInput label="Icon" value={b.icon} onChange={(e) => updateBadge(b.id, { icon: e.target.value })} />
              <AdminInput label="Name" value={b.name} onChange={(e) => updateBadge(b.id, { name: e.target.value })} />
            </div>
            <AdminTextarea label="Description" value={b.desc} onChange={(e) => updateBadge(b.id, { desc: e.target.value })} />
            <AdminButton variant="danger" onClick={() => removeBadge(b.id)}>
              Delete
            </AdminButton>
          </AdminCard>
        ))}
      </div>
    </div>
  )
}
