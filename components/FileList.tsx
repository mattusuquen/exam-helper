'use client'

interface Props {
  files: File[]
  onRemove: (index: number) => void
}

function fileTypeLabel(file: File): string {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return 'PDF'
  if (name.endsWith('.pptx')) return 'PPT'
  if (file.type.startsWith('image/')) return 'IMG'
  return 'FILE'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-red-50 text-red-700',
  PPT: 'bg-orange-50 text-orange-700',
  IMG: 'bg-violet-50 text-violet-700',
  FILE: 'bg-slate-100 text-slate-600',
}

export default function FileList({ files, onRemove }: Props) {
  if (files.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {files.map((file, i) => {
        const label = fileTypeLabel(file)
        return (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
          >
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_COLORS[label]}`}>
              {label}
            </span>
            <span className="flex-1 text-sm text-slate-700 truncate">{file.name}</span>
            <span className="text-xs text-slate-400 shrink-0">{formatSize(file.size)}</span>
            <button
              onClick={() => onRemove(i)}
              className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
