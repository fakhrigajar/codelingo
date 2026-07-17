import { useEffect } from 'react'

// `overflow: hidden` on body alone doesn't block touch scrolling on mobile
// Safari/Chrome — the underlying page can still rubber-band/scroll behind a
// fixed overlay. Pinning body with position: fixed (and restoring the scroll
// offset on unlock) is the reliable cross-browser way to lock it.
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const scrollY = window.scrollY
    const { position, top, width, overflow } = document.body.style

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = position
      document.body.style.top = top
      document.body.style.width = width
      document.body.style.overflow = overflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
