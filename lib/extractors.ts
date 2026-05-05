import { ProcessedContent } from './types'

export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic import avoids Next.js bundler evaluation issues
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)
  return data.text.trim()
}

export async function extractPptxText(buffer: Buffer): Promise<string> {
  const officeParser = require('officeparser')
  // v4.x: parseOfficeAsync accepts Buffer directly, returns string
  const text: string = await officeParser.parseOfficeAsync(buffer)
  return typeof text === 'string' ? text.trim() : ''
}

function normalizeImageMime(
  mime: string
): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'image/jpeg'
  if (mime.includes('png')) return 'image/png'
  if (mime.includes('gif')) return 'image/gif'
  if (mime.includes('webp')) return 'image/webp'
  return 'image/jpeg'
}

type ProcessedFile =
  | { type: 'text'; content: string }
  | { type: 'image'; base64: string; mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' }

export async function processFile(file: File): Promise<ProcessedFile> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const mime = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    const text = await extractPdfText(buffer)
    return { type: 'text', content: text }
  }

  if (
    mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    name.endsWith('.pptx')
  ) {
    const text = await extractPptxText(buffer)
    return { type: 'text', content: text }
  }

  if (mime.startsWith('image/')) {
    // ~3.75MB raw = ~5MB base64 — Claude vision limit
    const MAX_IMAGE_BYTES = 3.75 * 1024 * 1024
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error(`Image "${file.name}" exceeds the 5MB limit for vision processing`)
    }
    const mediaType = normalizeImageMime(mime)
    return { type: 'image', base64: buffer.toString('base64'), mediaType }
  }

  throw new Error(`Unsupported file type: ${file.name} (${mime || 'unknown type'})`)
}

export async function processAllFiles(files: File[]): Promise<ProcessedContent> {
  const results = await Promise.allSettled(files.map(processFile))
  const processed: ProcessedContent = { textBlocks: [], imageBlocks: [] }

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('File processing error:', result.reason)
      continue
    }
    const val = result.value
    if (val.type === 'text' && val.content.length > 0) {
      processed.textBlocks.push(val.content)
    } else if (val.type === 'image') {
      processed.imageBlocks.push({ base64: val.base64, mediaType: val.mediaType })
    }
  }

  return processed
}
