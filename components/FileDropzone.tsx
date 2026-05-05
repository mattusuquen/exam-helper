'use client'

import { useRef, useState } from 'react'

interface Props {
  onFilesAdded: (files: File[]) => void
}

const ACCEPT = '.pdf,.pptx,.png,.jpg,.jpeg'
const ACCEPT_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

function isAccepted(file: File) {
  return (
    ACCEPT_MIME.some((m) => file.type === m) ||
    /\.(pdf|pptx|png|jpe?g)$/i.test(file.name)
  )
}

export default function FileDropzone({ onFilesAdded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [didDrop, setDidDrop] = useState(false)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const accepted = Array.from(fileList).filter(isAccepted)
    if (accepted.length > 0) {
      onFilesAdded(accepted)
      setDidDrop(true)
      setTimeout(() => setDidDrop(false), 500)
    }
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
        group relative flex flex-col items-center justify-center gap-3 p-10 rounded-xl cursor-pointer
        border-2 border-dashed select-none overflow-hidden
        transition-all duration-200
        ${isDragOver
          ? 'border-pink-500 bg-pink-50 scale-[1.02]'
          : didDrop
          ? 'border-pink-400 bg-white ring-2 ring-pink-300 ring-offset-2'
          : 'border-gray-200 bg-white hover:border-gray-300'}
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

      {/* Ripple on drop */}
      {didDrop && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-16 h-16 rounded-full bg-pink-400 animate-ripple" />
        </span>
      )}

      {/* Upload icon — bobs up on hover/drag */}
      <svg
        className={`w-8 h-8 transition-transform duration-300 ${
          isDragOver
            ? 'text-pink-500 -translate-y-1'
            : 'text-gray-400 group-hover:-translate-y-1'
        }`}
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
        <p className="text-sm font-bold text-black">
          Drop files here or <span className="text-pink-500">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, PPTX, PNG, JPG</p>
      </div>
    </div>
  )
}
