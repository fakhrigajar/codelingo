import { useEffect, useState } from 'react'

// Watches the <html> class toggled by useTheme (see useTheme.js) rather than
// duplicating theme state — lets antd's ConfigProvider follow the same dark
// mode as the rest of the app without a shared ThemeContext.
export function useIsDarkMode() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')))
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}
