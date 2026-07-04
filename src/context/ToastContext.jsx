import { createContext, useContext, useCallback, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)
  const timerRef = useRef(null)

  const toast = useCallback((msg) => {
    setMessage(msg)
    setShow(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShow(false), 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-dark text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,.4)] z-[999] transition-all duration-250 pointer-events-none ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
