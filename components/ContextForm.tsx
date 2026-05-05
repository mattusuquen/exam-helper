'use client'

import { Difficulty } from '@/lib/types'

interface Props {
  context: string
  setContext: (v: string) => void
  questionCount: number
  setQuestionCount: (v: number) => void
  difficulty: Difficulty
  setDifficulty: (v: Difficulty) => void
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export default function ContextForm({
  context,
  setContext,
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Additional context */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Additional context</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Focus on Chapter 3, emphasize thermodynamics concepts..."
          rows={3}
          className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg
            placeholder:text-slate-400 text-slate-800 resize-none
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            transition-colors"
        />
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Question count */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-sm font-medium text-slate-700">
            Questions
            <span className="ml-2 font-bold text-blue-600">{questionCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Difficulty</label>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  difficulty === d
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
