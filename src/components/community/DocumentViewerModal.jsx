import { useEffect, useState } from 'react'
import { Modal, Button, Spin } from 'antd'
import DOMPurify from 'dompurify'
import { Download, FileText } from 'lucide-react'

const TEXT_MIMES = new Set(['text/plain', 'text/csv'])
const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// PDFs render inline via iframe (native browser support). .docx gets a real
// rendered preview by converting to HTML client-side with mammoth (already
// a dependency for the CV analyzer's resume parsing) — its output is
// sanitized with DOMPurify before going into the DOM since it comes from a
// community member's own uploaded file, not code we wrote. Plain text/CSV
// render as-is. Everything else (legacy .doc, Excel, PowerPoint, .rtf) has
// no reliable browser-native renderer without a much heavier library, so
// those fall back to a download card instead of a broken preview.
export default function DocumentViewerModal({ document, open, onClose }) {
  const [status, setStatus] = useState('idle')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!open || !document) return

    if (document.mime === 'application/pdf') {
      setStatus('pdf')
      return
    }

    if (TEXT_MIMES.has(document.mime)) {
      setStatus('loading')
      fetch(document.url)
        .then((res) => {
          if (!res.ok) throw new Error('fetch failed')
          return res.text()
        })
        .then((text) => {
          setContent(text)
          setStatus('text')
        })
        .catch(() => setStatus('unsupported'))
      return
    }

    if (document.mime === DOCX_MIME) {
      setStatus('loading')
      Promise.all([fetch(document.url).then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.arrayBuffer()
      }), import('mammoth')])
        .then(([buffer, { default: mammoth }]) => mammoth.convertToHtml({ arrayBuffer: buffer }))
        .then((result) => {
          setContent(DOMPurify.sanitize(result.value))
          setStatus('html')
        })
        .catch(() => setStatus('unsupported'))
      return
    }

    setStatus('unsupported')
  }, [open, document])

  if (!document) return null

  const wide = status === 'pdf' || status === 'html'

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={document.name}
      width={wide ? 820 : 480}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button key="download" type="primary" href={document.url} target="_blank" rel="noreferrer">
          <Download size={14} className="inline -mt-0.5 mr-1" /> Download
        </Button>,
      ]}
    >
      {status === 'pdf' && (
        <iframe
          src={document.url}
          title={document.name}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
      )}

      {status === 'loading' && (
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      )}

      {status === 'text' && (
        <pre className="whitespace-pre-wrap break-words text-sm bg-[#F1F5FD] dark:bg-white/10 rounded-xl p-4 max-h-[65vh] overflow-y-auto">
          {content}
        </pre>
      )}

      {status === 'html' && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none max-h-[65vh] overflow-y-auto px-1"
          // eslint-disable-next-line react/no-danger -- sanitized above with DOMPurify
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {status === 'unsupported' && (
        <div className="flex flex-col items-center gap-3 py-10">
          <FileText size={56} className="text-violet" />
          <div className="font-bold text-center">{document.name}</div>
          <p className="text-ink-soft dark:text-white/60 text-sm text-center">
            No inline preview for this file type — download it to open in its own app.
          </p>
        </div>
      )}
    </Modal>
  )
}
