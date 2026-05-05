'use client'

import { useRef, useState } from 'react'

interface Props {
  onFilesAdded: (files: File[]) => void
}

const ACCEPT = '.pdf,.pptx,.png,.jpg,.jpeg'
const ACCEPT_MIME = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/png', 'image/jpeg', 'image/jpg']

function isAccepted(file: File) {
  return (
    ACCEPT_MIME.some((m) => file.type === m) ||
    /\.(pdf|pptx|png|jpe?g)$/i.test(file.name)
  )
}

export default function FileDropzone({ onFilesAdded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const accepted = Array.from(fileList).filter(isAccepted)
    if (accepted.length > 0) onFilesAdded(accepted)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`
        flex flex-col items-center justify-center gap-3 p-10 rounded-xl cursor-pointer
        border-2 border-dashed transition-colors select-none
        ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <svg
        className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-slate-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          Drop files here or <span className="text-blue-600">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">PDF, PPTX, PNG, JPG</p>
      </div>
    </div>
  )
}
