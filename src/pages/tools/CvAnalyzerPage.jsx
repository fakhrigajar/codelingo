import { useState } from 'react'
import { Bot } from 'lucide-react'
import CvAnalyzer from '../../components/cv/CvAnalyzer'

export default function CvAnalyzerPage() {
  const [analyzeData, setAnalyzeData] = useState({ text: '', fileName: '', targetRole: '' })

  const handleAnalyzeChange = (patch) => {
    setAnalyzeData((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <span>Tools</span>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">CV Analyzer</span>
      </nav>

      <span className="eyebrow">
        <Bot size={13} /> AI career tools
      </span>
      <h1 className="text-[2rem]">AI-Powered CV Analyzer</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
        Upload your CV and get a live ATS-friendliness score with concrete, AI-powered tips to
        improve it.
      </p>

      <CvAnalyzer
        text={analyzeData.text}
        fileName={analyzeData.fileName}
        targetRole={analyzeData.targetRole}
        onChange={handleAnalyzeChange}
      />
    </div>
  )
}
