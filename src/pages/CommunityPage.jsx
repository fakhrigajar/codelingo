import { useEffect, useRef, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { listRoomMessages, postMessage as postMessageApi } from '../lib/chatApi'
import { initials } from '../lib/helpers'

export default function CommunityPage() {
  const { rooms } = useContent()
  const { currentUser, saveCurrentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [activeRoom, setActiveRoom] = useState(rooms[0]?.id)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const boxRef = useRef(null)
  const pollRef = useRef(null)

  const room = rooms.find((r) => r.id === activeRoom) || rooms[0]

  const loadMessages = () => {
    if (!room) return
    listRoomMessages(room.id)
      .then(setMessages)
      .catch(() => {})
  }

  useEffect(() => {
    loadMessages()
    pollRef.current = setInterval(loadMessages, 4000)
    return () => clearInterval(pollRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom])

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [messages])

  if (!room) {
    return (
      <div className="pt-12">
        <h1 className="text-[2.2rem]">Community</h1>
        <p className="text-ink-soft dark:text-white/60">No chat rooms have been set up yet.</p>
      </div>
    )
  }

  const sendChat = async () => {
    const text = input.trim()
    if (!text) return
    if (!currentUser) {
      toast('Log in to join the conversation!')
      navigate('/account')
      return
    }
    setInput('')
    try {
      const saved = await postMessageApi(room.id, {
        username: currentUser.username,
        displayName: currentUser.displayName,
        text,
      })
      setMessages((prev) => [...prev, saved])
    } catch {
      toast('Could not send that — try again.')
      return
    }
    if (!currentUser.badges.includes('chatterbox')) {
      saveCurrentUser({ ...currentUser, badges: [...currentUser.badges, 'chatterbox'] })
      toast('New badge: Chatterbox 💬')
    }
  }

  return (
    <div>
      <div className="grid desktop:grid-cols-[220px_1fr] gap-6 pt-11">
        <div className="flex flex-col gap-2">
          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoom(r.id)}
              className={`text-left px-3.5 py-3 rounded-xl border-2 font-bold text-[.92rem] ${
                activeRoom === r.id ? 'bg-violet border-violet text-white' : 'bg-white dark:bg-white/5 border-line dark:border-white/10 text-ink-soft dark:text-white/60'
              }`}
            >
              # {r.name}
            </button>
          ))}
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] flex flex-col h-[420px] sm:h-[480px] desktop:h-[560px] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-line dark:border-white/10 flex justify-between items-center">
            <h3 className="m-0 text-[1.05rem]"># {room.name}</h3>
            <span className="font-mono text-xs text-ink-soft dark:text-white/60">{room.sub}</span>
          </div>
          <div ref={boxRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
            {messages.length === 0 && (
              <p className="text-ink-soft dark:text-white/60 text-center mt-10">No messages yet — be the first to say hi! 👋</p>
            )}
            {messages.slice(-100).map((m, i) => {
              const mine = currentUser && m.username === currentUser.username
              const time = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={i} className={`flex gap-3 max-w-[80%] ${mine ? 'flex-row-reverse ml-auto' : ''}`}>
                  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold text-[.8rem] flex-shrink-0">
                    {initials(m.displayName)}
                  </div>
                  <div>
                    <div
                      className={`rounded-xl px-3.5 py-2.5 ${
                        mine ? 'bg-indigo-dark dark:bg-violet text-white rounded-tr-[3px]' : 'bg-[#F1F5FD] dark:bg-white/10 rounded-tl-[3px]'
                      }`}
                    >
                      <div className={`font-extrabold text-[.8rem] mb-0.5 ${mine ? 'text-[#BFD0FF]' : 'text-indigo-dark dark:text-white'}`}>
                        {m.displayName}
                        <span className="font-mono text-[.65rem] text-[#9AA6C7] ml-2">{time}</span>
                      </div>
                      {m.text}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-2.5 px-4 py-3.5 border-t-2 border-line dark:border-white/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              maxLength={240}
              placeholder="Say something friendly..."
              className="flex-1 bg-white dark:bg-white/5 border-2 border-line dark:border-white/15 dark:text-white rounded-xl px-3.5 py-3 font-body text-[.95rem] focus:border-violet outline-none"
            />
            <button className="btn btn-dark btn-sm" onClick={sendChat}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
