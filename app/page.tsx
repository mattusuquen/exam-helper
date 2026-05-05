'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Difficulty, Question } from '@/lib/types'
import FileDropzone from '@/components/FileDropzone'
import FileList from '@/components/FileList'
import ContextForm from '@/components/ContextForm'
import GenerateButton from '@/components/GenerateButton'
import ResultsGrid from '@/components/ResultsGrid'

const LOADING_MESSAGES = [
  'Analyzing your slides...',
  'Extracting key concepts...',
  'Crafting questions...',
  'Reviewing distractors...',
  'Almost done...',
]

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [context, setContext] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const messageIndex = useRef(0)

  // Rotate loading messages while generating
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
    setQuestions([])

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

      setQuestions(data.questions)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">Exam Helper</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Generate exam questions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload your slides, add context, and get multiple-choice questions with solutions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Upload area */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-700">Slides</h2>
            <FileDropzone onFilesAdded={addFiles} />
            <FileList files={files} onRemove={removeFile} />
          </div>

          {/* Options */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Options</h2>
            <ContextForm
              context={context}
              setContext={setContext}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <GenerateButton
            isLoading={isLoading}
            disabled={files.length === 0}
            loadingMessage={loadingMessage}
          />
        </form>

        {/* Results */}
        {questions.length > 0 && (
          <div ref={resultsRef}>
            <hr className="border-slate-200 mb-8" />
            <ResultsGrid questions={questions} />
          </div>
        )}
      </main>
    </div>
  )
}
