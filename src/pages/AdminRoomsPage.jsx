import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import { listRoomMessages, clearRoomMessages } from '../lib/chatApi'
import AdminCard from '../components/admin/AdminCard'
import { AdminInput, AdminButton } from '../components/admin/AdminFields'

export default function AdminRoomsPage() {
  const { rooms, setRooms } = useContent()
  const toast = useToast()
  const [counts, setCounts] = useState({})

  useEffect(() => {
    rooms.forEach((r) => {
      listRoomMessages(r.id)
        .then((msgs) => setCounts((prev) => ({ ...prev, [r.id]: msgs.length })))
        .catch(() => {})
    })
  }, [rooms])

  const updateRoom = (id, patch) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const removeRoom = (id) => {
    if (!confirm('Delete this room and its message history?')) return
    setRooms(rooms.filter((r) => r.id !== id))
    clearRoomMessages(id).catch(() => {})
    toast('Room deleted')
  }

  const clearMessages = (id) => {
    if (!confirm('Clear all messages in this room?')) return
    clearRoomMessages(id)
      .then(() => setCounts((prev) => ({ ...prev, [id]: 0 })))
      .catch(() => toast('Could not clear messages — try again.'))
    toast('Messages cleared')
  }

  const addRoom = () => {
    setRooms([...rooms, { id: uid('room'), name: 'New Room', sub: 'What is this room for?' }])
    toast('Room added')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h1 className="text-2xl m-0">Chat rooms</h1>
        <AdminButton onClick={addRoom}>+ Add room</AdminButton>
      </div>
      <p className="text-ink-soft mb-6">Rename community rooms or clear a room's message history.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {rooms.map((r) => {
          const count = counts[r.id] ?? 0
          return (
            <AdminCard key={r.id}>
              <AdminInput label="Room name" value={r.name} onChange={(e) => updateRoom(r.id, { name: e.target.value })} />
              <AdminInput label="Subtitle" value={r.sub} onChange={(e) => updateRoom(r.id, { sub: e.target.value })} />
              <p className="text-ink-soft text-[.8rem] mb-3">{count} message{count === 1 ? '' : 's'} stored</p>
              <div className="flex gap-2">
                <AdminButton variant="outline" onClick={() => clearMessages(r.id)}>
                  Clear messages
                </AdminButton>
                <AdminButton variant="danger" onClick={() => removeRoom(r.id)}>
                  Delete room
                </AdminButton>
              </div>
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
