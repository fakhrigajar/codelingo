import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import { BADGE_ICON_NAMES, getBadgeIcon } from '../lib/badgeIcons'
import AdminCard from '../components/admin/AdminCard'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from '../components/admin/AdminFields'

export default function AdminBadgesPage() {
  const { badges, setBadges } = useContent()
  const toast = useToast()
  const [draft, setDraft] = useState(badges)

  // Adopts the live list's membership (after an immediate add/remove) while
  // keeping any in-progress edits for badges that still exist.
  useEffect(() => {
    setDraft((prev) => badges.map((b) => prev.find((p) => p.id === b.id) ?? b))
  }, [badges])

  const patchBadge = (id, patch) => {
    setDraft((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const removeBadge = (id) => {
    if (!confirm('Delete this badge? Learners who already earned it will keep the id, but it will stop showing up.')) return
    setBadges(badges.filter((b) => b.id !== id))
    toast('Badge deleted')
  }

  const addBadge = () => {
    setBadges([...badges, { id: uid('badge'), icon: 'award', name: 'New Badge', desc: 'Describe how to earn this.' }])
    toast('Badge added')
  }

  const handleSubmit = () => {
    setBadges(draft)
    toast('Changes saved')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h1 className="text-2xl m-0">Badges</h1>
        <AdminButton onClick={addBadge}>+ Add badge</AdminButton>
      </div>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        Change the icon, name and description shown on learner profiles. Edits are staged until you save.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {draft.map((b) => {
          const Icon = getBadgeIcon(b.icon)
          return (
            <AdminCard key={b.id}>
              <div className="grid grid-cols-[70px_1fr] gap-3 items-end">
                <div className="w-full h-[42px] flex items-center justify-center border-2 border-line dark:border-white/15 rounded-[10px] text-violet mb-3">
                  <Icon size={20} />
                </div>
                <AdminSelect label="Icon" value={b.icon} onChange={(e) => patchBadge(b.id, { icon: e.target.value })}>
                  {BADGE_ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </AdminSelect>
              </div>
              <AdminInput
                label="Name"
                placeholder="e.g. First Steps"
                value={b.name}
                onChange={(e) => patchBadge(b.id, { name: e.target.value })}
              />
              <AdminTextarea
                label="Description"
                placeholder="What does a learner need to do to earn this badge?"
                value={b.desc}
                onChange={(e) => patchBadge(b.id, { desc: e.target.value })}
              />
              <AdminButton variant="danger" onClick={() => removeBadge(b.id)}>
                Delete
              </AdminButton>
            </AdminCard>
          )
        })}
      </div>

      <div className="flex justify-end mt-6">
        <AdminButton onClick={handleSubmit}>Save changes</AdminButton>
      </div>
    </div>
  )
}
