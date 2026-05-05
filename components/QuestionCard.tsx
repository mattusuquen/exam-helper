'use client'

import { useState } from 'react'
import { Question } from '@/lib/types'

interface Props {
  question: Question
  index: number
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export default function QuestionCard({ question, index }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
      {/* Question header */}
      <div className="flex gap-3">
        <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-slate-800 leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const label = OPTION_LABELS[i]
          const isSelected = selected === label
          const isCorrect = question.correctAnswer === label

          let optionClass =
            'flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm cursor-pointer transition-colors '

          if (isRevealed && isCorrect) {
            optionClass += 'border-green-200 bg-green-50 text-green-800'
          } else if (isRevealed && isSelected && !isCorrect) {
            optionClass += 'border-red-200 bg-red-50 text-red-700'
          } else if (isSelected) {
            optionClass += 'border-blue-400 bg-blue-50 text-blue-800'
          } else {
            optionClass += 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }

          return (
            <div
              key={label}
              onClick={() => !isRevealed && setSelected(label)}
              className={optionClass}
            >
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded border border-current text-[10px] font-bold opacity-60">
                {label}
              </span>
              <span className="leading-relaxed">{opt.replace(/^[A-D]\.\s*/, '')}</span>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {isRevealed && (
        <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Explanation: </span>
          {question.explanation}
        </div>
      )}

      {/* Reveal toggle */}
      <button
        onClick={() => setIsRevealed((r) => !r)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium self-start transition-colors"
      >
        {isRevealed ? 'Hide answer' : 'Show answer'}
      </button>
    </div>
  )
}
