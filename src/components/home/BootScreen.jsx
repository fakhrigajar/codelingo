import { useEffect, useRef, useState } from 'react'

const NODES = ['🖥️', '⌨️', '🧩', '🌐', '🎨', '🤖']
const MESSAGES = ['Booting pixels', 'Loading curiosity', 'Wiring up circuits', 'Almost there', 'Ready to learn!']

export default function BootScreen() {
  const [pct, setPct] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const total = 2400
    const stepTime = total / 100
    timerRef.current = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + 2)
        if (next >= 100) clearInterval(timerRef.current)
        return next
      })
    }, stepTime)
    return () => clearInterval(timerRef.current)
  }, [])

  const litCount = Math.floor((pct / 100) * NODES.length)
  const msg = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(pct / 22))]

  return (
    <div className="bg-indigo-dark rounded-[22px] p-3.5 shadow-monitor">
      <div className="flex gap-1.5 px-1.5 pb-3 pt-0.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3A4470]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3A4470]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3A4470]" />
      </div>
      <div className="bg-[#0F1830] rounded-xl p-6 min-h-[300px] font-mono text-[#8FE3C0] relative overflow-hidden">
        <div className="whitespace-pre text-[.92rem] animate-typeIn opacity-0 [animation-delay:.1s]">
          &gt; booting ICT_Quest.exe
        </div>
        <div className="whitespace-pre text-[.92rem] animate-typeIn opacity-0 [animation-delay:.5s]">
          &gt; loading curiosity module...
        </div>
        <div className="whitespace-pre text-[.92rem] animate-typeIn opacity-0 [animation-delay:.9s]">
          &gt; loading courage.dll...
        </div>
        <div className="mt-4.5 mt-[18px] h-3 bg-[#1E2A4F] rounded-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-mint to-sun rounded-lg transition-[width] duration-[2.4s] ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 text-[.78rem] text-[#6C7BA8] font-mono">
          {pct}% — {msg}
        </div>
        <div className="flex gap-2.5 mt-5 flex-wrap">
          {NODES.map((n, i) => (
            <div
              key={i}
              className={`text-xl bg-[#16213E] border border-[#2A3760] rounded-[10px] w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                i < litCount ? 'opacity-100 scale-100 shadow-[0_0_0_2px_#2FC493_inset]' : 'opacity-25 scale-90'
              }`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
