import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, onToggle, className = '', showLabel = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
      {showLabel && (theme === 'dark' ? 'Light mode' : 'Dark mode')}
    </button>
  )
}
