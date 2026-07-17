import { createContext, useContext, useEffect, useRef, useState } from 'react'

// Two contexts on purpose: SetBarContext's value (the useState setter) is
// referentially stable forever, so useAdminSaveBar's effect only re-runs
// when `dirty`/`message` actually change. If pages read the bar's *value*
// through the same context they write through, every render would put a
// changing object in its own dependency array and loop.
const SetBarContext = createContext(null)
const BarContext = createContext(null)

export function AdminSaveBarProvider({ children }) {
  const [bar, setBar] = useState(null)
  return (
    <SetBarContext.Provider value={setBar}>
      <BarContext.Provider value={bar}>{children}</BarContext.Provider>
    </SetBarContext.Provider>
  )
}

export function useAdminSaveBarState() {
  return useContext(BarContext)
}

/**
 * Registers the current admin page's unsaved-changes state with the single
 * floating save bar rendered in AdminLayout, so pages never render their
 * own copy of that surface — they just report `dirty` plus save/discard.
 */
export function useAdminSaveBar({ dirty, message, onSave, onDiscard }) {
  const setBar = useContext(SetBarContext)
  const handlers = useRef({ onSave, onDiscard })
  handlers.current = { onSave, onDiscard }

  useEffect(() => {
    if (!setBar) return
    setBar({
      dirty,
      message,
      onSave: () => handlers.current.onSave?.(),
      onDiscard: handlers.current.onDiscard ? () => handlers.current.onDiscard() : null,
    })
  }, [setBar, dirty, message])

  useEffect(() => {
    if (!setBar) return
    return () => setBar(null)
  }, [setBar])
}
