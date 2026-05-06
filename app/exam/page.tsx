'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Question } from '@/lib/types'
import ExamRunner from '@/components/ExamRunner'

interface ExamData {
  questions: Question[]
  secondsPerQuestion: number
  difficulty: string
  timerEnabled?: boolean
}

export default function ExamPage() {
  const router = useRouter()
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('exam-data')
      if (!raw) { setMissing(true); return }
      setExamData(JSON.parse(raw))
    } catch {
      setMissing(true)
    }
  }, [])

  if (missing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-400">No exam found.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Generate an exam
        </button>
      </div>
    )
  }

  if (!examData) return null

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm font-black text-black tracking-tight">Exam Helper</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <ExamRunner
          questions={examData.questions}
          secondsPerQuestion={examData.secondsPerQuestion}
          difficulty={examData.difficulty}
          timerEnabled={examData.timerEnabled ?? true}
          onGenerateNew={() => router.push('/')}
        />
      </main>
    </div>
  )
}
