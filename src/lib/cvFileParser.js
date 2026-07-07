import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

async function extractFromPdf(file) {
  const buffer = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return pages.join('\n\n')
}

async function extractFromDocx(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}

// Extracts plain text from an uploaded resume file (.pdf, .docx, or .txt) so
// it can be fed into the same ATS heuristics used for pasted/typed text.
export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return extractFromPdf(file)
  }
  if (
    name.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractFromDocx(file)
  }
  if (name.endsWith('.txt') || file.type === 'text/plain') {
    return file.text()
  }
  if (name.endsWith('.doc')) {
    throw new Error('Old .doc files aren\'t supported — please save as .docx or .pdf and try again.')
  }
  throw new Error('Unsupported file type — please upload a .pdf, .docx, or .txt file.')
}
