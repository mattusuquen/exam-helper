'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Difficulty } from '@/lib/types'
import FileDropzone from '@/components/FileDropzone'
import FileList from '@/components/FileList'
import ContextForm from '@/components/ContextForm'
import GenerateButton from '@/components/GenerateButton'

const LOADING_MESSAGES = [
  'Analyzing your slides...',
  'Extracting key concepts...',
  'Crafting questions...',
  'Reviewing distractors...',
  'Almost done...',
]

export default function HomePage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [context, setContext] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(60)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [error, setError] = useState<string | null>(null)
  const messageIndex = useRef(0)

  useEffect(() => {
    if (!isLoading) return
    messageIndex.current = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      messageIndex.current = Math.min(messageIndex.current + 1, LOADING_MESSAGES.length - 1)
      setLoadingMessage(LOADING_MESSAGES[messageIndex.current])
    }, 4000)
    return () => clearInterval(interval)
  }, [isLoading])

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...incoming.filter((f) => !names.has(f.name))]
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    formData.append('context', context)
    formData.append('questionCount', String(questionCount))
    formData.append('difficulty', difficulty)

    try {
      const res = await fetch('/api/generate', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      sessionStorage.setItem('exam-data', JSON.stringify({
        questions: data.questions,
        secondsPerQuestion,
        difficulty,
        timerEnabled,
      }))
      router.push('/exam')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <span className="text-sm font-black text-black tracking-tight">Exam Helper</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-tight animate-fade-up">
            Generate your exam
          </h1>
          <p className="mt-2 text-base text-gray-400 animate-fade-up delay-100">
            Upload your slides and get timed multiple-choice questions instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 animate-fade-up delay-150">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Slides</h2>
            <FileDropzone onFilesAdded={addFiles} />
            <FileList files={files} onRemove={removeFile} />
          </div>

          <div className="flex flex-col gap-3 animate-fade-up delay-200">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Options</h2>
            <ContextForm
              context={context}
              setContext={setContext}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              secondsPerQuestion={secondsPerQuestion}
              setSecondsPerQuestion={setSecondsPerQuestion}
              timerEnabled={timerEnabled}
              setTimerEnabled={setTimerEnabled}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-up">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="animate-fade-up delay-250">
            <GenerateButton
              isLoading={isLoading}
              disabled={files.length === 0}
              loadingMessage={loadingMessage}
            />
          </div>
        </form>
      </main>
    </div>
  )
}
