'use client'

import { Question } from '@/lib/types'
import QuestionCard from './QuestionCard'

interface Props {
  questions: Question[]
}

export default function ResultsGrid({ questions }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Generated Exam
          <span className="ml-2 text-sm font-normal text-slate-400">{questions.length} questions</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {questions.map((q, i) => (
          <QuestionCard key={i} question={q} index={i} />
        ))}
      </div>
    </section>
  )
}
