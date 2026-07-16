import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, Paperclip, FileText, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { uploadFile } from '../../lib/uploadFile'

const DOCUMENT_ACCEPT = '.pdf,.txt,.csv,.rtf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
const DOCUMENT_TOOLTIP = 'Allowed files: PDF, text (.txt, .csv, .rtf), Microsoft Office (Word, Excel, PowerPoint)'

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// A native `title` attribute has an inconsistent OS-controlled delay and no
// animation — this renders its own tooltip above the button that fades and
// slides up on hover, so it always looks and behaves the same everywhere.
function IconButtonWithTooltip({ tooltip, ...buttonProps }) {
  return (
    <div className="relative group/tip">
      <button {...buttonProps} />
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] whitespace-normal rounded-lg bg-indigo-dark dark:bg-white px-2.5 py-1.5 text-center text-[.72rem] font-bold text-white dark:text-indigo-dark opacity-0 translate-y-1 transition-all duration-200 z-10 group-hover/tip:opacity-100 group-hover/tip:translate-y-0"
      >
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-dark dark:border-t-white" />
      </div>
    </div>
  )
}

export default function PostComposer({ onSubmit }) {
  const { currentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const imageInputRef = useRef(null)
  const documentInputRef = useRef(null)

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [doc, setDoc] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)

  const requireAuth = () => {
    if (currentUser) return true
    toast('Log in to post in the community!')
    navigate('/account')
    return false
  }

  const attach = async (file, setter) => {
    if (!file || !requireAuth()) return
    setUploading(true)
    try {
      const dataUrl = await readAsDataUrl(file)
      const uploaded = await uploadFile(dataUrl, file.name)
      setter({ ...uploaded, name: file.name })
    } catch (err) {
      toast(err.message || 'Could not upload that file.')
    } finally {
      setUploading(false)
    }
  }

  const handleImagePick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    attach(file, setImage)
  }

  const handleDocumentPick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    attach(file, setDoc)
  }

  const handleSubmit = async () => {
    if (!requireAuth()) return
    const trimmed = text.trim()
    if (!trimmed && !image && !doc) return
    setPosting(true)
    try {
      await onSubmit({ text: trimmed, image, document: doc })
      setText('')
      setImage(null)
      setDoc(null)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2000}
        placeholder={
          currentUser
            ? "What are you building? Ask a question or share something..."
            : 'Log in to post in the community...'
        }
        className="w-full min-h-[80px] resize-none bg-transparent dark:text-white font-body text-[.95rem] outline-none placeholder:text-ink-soft dark:placeholder:text-white/40"
      />

      {image && (
        <div className="relative inline-block mt-2">
          <img
            src={image.url}
            alt=""
            className="max-h-40 rounded-xl border-2 border-line dark:border-white/10"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-indigo-dark text-white rounded-full p-1"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {doc && (
        <div className="flex items-center gap-2 mt-2 bg-[#F1F5FD] dark:bg-white/10 rounded-xl px-3.5 py-2.5 w-fit">
          <FileText size={16} className="text-ink-soft dark:text-white/60 shrink-0" />
          <span className="text-[.85rem] font-bold truncate max-w-[200px]">{doc.name}</span>
          <button type="button" onClick={() => setDoc(null)} aria-label="Remove document">
            <X size={14} className="text-ink-soft dark:text-white/60" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-line dark:border-white/10">
        <div className="flex gap-1.5">
          <IconButtonWithTooltip
            tooltip="Add an image"
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded-lg text-ink-soft dark:text-white/60 hover:bg-[#F1F5FD] dark:hover:bg-white/10 disabled:opacity-40"
            aria-label="Add image"
          >
            <ImageIcon size={18} />
          </IconButtonWithTooltip>
          <IconButtonWithTooltip
            tooltip={DOCUMENT_TOOLTIP}
            type="button"
            onClick={() => documentInputRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded-lg text-ink-soft dark:text-white/60 hover:bg-[#F1F5FD] dark:hover:bg-white/10 disabled:opacity-40"
            aria-label="Add document"
          >
            <Paperclip size={18} />
          </IconButtonWithTooltip>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
          <input
            ref={documentInputRef}
            type="file"
            accept={DOCUMENT_ACCEPT}
            className="hidden"
            onChange={handleDocumentPick}
          />
        </div>
        <button
          className="btn btn-dark btn-sm"
          onClick={handleSubmit}
          disabled={posting || uploading || (!text.trim() && !image && !doc)}
        >
          {uploading ? 'Uploading…' : posting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  )
}
