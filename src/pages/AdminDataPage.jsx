import { useRef, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import AdminCard from '../components/admin/AdminCard'
import { AdminButton } from '../components/admin/AdminFields'

export default function AdminDataPage() {
  const { exportData, importData, resetToDefault } = useContent()
  const toast = useToast()
  const fileRef = useRef(null)
  const [error, setError] = useState('')

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codelingo-content-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Content exported')
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const res = importData(reader.result)
      if (res.ok) {
        toast('Content imported successfully')
        setError('')
      } else {
        setError(`Import failed: ${res.error}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (!confirm('Reset badges back to the original demo content? Courses, paths, learner accounts and community posts are not affected — edit or restore those from a backup instead.')) return
    resetToDefault()
    toast('Content reset to defaults')
  }

  return (
    <div>
      <h1 className="text-2xl mb-1">Backup &amp; reset</h1>
      <p className="text-ink-soft dark:text-white/60 mb-6">Save your edits to a file, restore from a file, or start over.</p>

      <AdminCard title="Export content" className="mb-4">
        <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-3">
          Download all courses, paths and badges as a JSON file you can keep as a backup.
        </p>
        <AdminButton onClick={handleExport}>Download backup (.json)</AdminButton>
      </AdminCard>

      <AdminCard title="Import content" className="mb-4">
        <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-3">
          Restore content from a previously exported JSON file. This replaces everything currently on the site.
        </p>
        {error && (
          <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-3">
            {error}
          </div>
        )}
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImportFile} className="text-sm" />
      </AdminCard>

      <AdminCard title="Reset to defaults">
        <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-3">
          Wipe admin edits to badges and the page header text, and restore the original demo content. Courses,
          paths, learner accounts and community posts are not affected — restore those from a backup file above
          instead.
        </p>
        <AdminButton variant="danger" onClick={handleReset}>
          Reset content to defaults
        </AdminButton>
      </AdminCard>
    </div>
  )
}
