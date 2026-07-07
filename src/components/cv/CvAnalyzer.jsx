import { useRef, useState } from 'react'
import AiFeedbackCard from './AiFeedbackCard'
import AiFeedbackDetails from './AiFeedbackDetails'
import { extractTextFromFile } from '../../lib/cvFileParser'
import { analyzeResumeWithAI } from '../../lib/aiReview'

export default function CvAnalyzer({ text, fileName, targetRole, onChange }) {
  const [fileStatus, setFileStatus] = useState('idle') // idle | parsing | error
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const [aiStatus, setAiStatus] = useState('idle') // idle | loading | error
  const [aiError, setAiError] = useState('')
  const [aiResult, setAiResult] = useState(null)

  const hasContent = text.trim().length > 0

  const handleFile = async (file) => {
    if (!file) return
    setFileStatus('parsing')
    setFileError('')
    try {
      const extracted = await extractTextFromFile(file)
      if (!extracted.trim()) {
        throw new Error('No readable text found in that file — try a different file.')
      }
      onChange({ text: extracted, fileName: file.name })
      setFileStatus('idle')
    } catch (err) {
      setFileError(err.message || 'Could not read that file.')
      setFileStatus('error')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleRemove = () => {
    onChange({ text: '', fileName: '' })
    setFileStatus('idle')
    setFileError('')
    setAiResult(null)
    setAiError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const runAnalysis = async () => {
    setAiStatus('loading')
    setAiError('')
    try {
      const res = await analyzeResumeWithAI({ resumeText: text, targetRole })
      setAiResult(res)
      setAiStatus('idle')
    } catch (err) {
      setAiError(err.message)
      setAiStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid desktop:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6">
          <label className="block font-bold text-sm mb-1.5 text-ink-soft dark:text-white/60">
            Upload your CV
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed rounded-2xl px-6 py-10 cursor-pointer transition-colors ${
              dragOver
                ? 'border-violet bg-violet/10'
                : 'border-line dark:border-white/15 hover:border-violet/60'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="text-3xl">📄</span>
            {fileStatus === 'parsing' ? (
              <span className="font-bold text-[.92rem]">Reading your CV...</span>
            ) : fileName ? (
              <span className="font-bold text-[.92rem]">{fileName}</span>
            ) : (
              <>
                <span className="font-bold text-[.92rem]">Drop your CV here or click to browse</span>
                <span className="text-[.8rem] text-ink-soft dark:text-white/50">
                  Supports .pdf, .docx, and .txt
                </span>
              </>
            )}
          </div>

          {fileError && (
            <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mt-3">
              {fileError}
            </div>
          )}

          {fileName && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-[.82rem] font-bold text-coral hover:underline mt-3"
            >
              Remove file
            </button>
          )}

          <div className="field mt-5">
            <label>Target job keywords (optional)</label>
            <textarea
              rows={2}
              value={targetRole}
              onChange={(e) => onChange({ targetRole: e.target.value })}
              placeholder="React, TypeScript, Agile, CI/CD"
            />
          </div>
        </div>

        <AiFeedbackCard
          hasContent={hasContent}
          status={aiStatus}
          error={aiError}
          result={aiResult}
          onAnalyze={runAnalysis}
        />
      </div>

      <AiFeedbackDetails result={aiResult} />
    </div>
  )
}
