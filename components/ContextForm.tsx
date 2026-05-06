'use client'

import { Difficulty } from '@/lib/types'

interface Props {
  context: string
  setContext: (v: string) => void
  questionCount: number
  setQuestionCount: (v: number) => void
  difficulty: Difficulty
  setDifficulty: (v: Difficulty) => void
  secondsPerQuestion: number
  setSecondsPerQuestion: (v: number) => void
  timerEnabled: boolean
  setTimerEnabled: (v: boolean) => void
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

function formatTime(s: number) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem === 0 ? `${m}m` : `${m}m ${rem}s`
}

export default function ContextForm({
  context,
  setContext,
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  secondsPerQuestion,
  setSecondsPerQuestion,
  timerEnabled,
  setTimerEnabled,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Additional context */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-black">Additional context</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Focus on Chapter 3, emphasize thermodynamics concepts..."
          rows={3}
          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
            placeholder:text-gray-400 text-black resize-none
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            transition-colors"
        />
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Question count */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-sm font-bold text-black">
            Questions
            <span className="ml-2 font-black text-pink-500">{questionCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-black">Difficulty</label>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-colors ${
                  difficulty === d
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Time per question */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-bold ${timerEnabled ? 'text-black' : 'text-gray-400'}`}>
              Time per question
              {timerEnabled && (
                <span className="ml-2 font-black text-pink-500">{formatTime(secondsPerQuestion)}</span>
              )}
            </label>
            <button
              type="button"
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                timerEnabled ? 'bg-pink-500' : 'bg-gray-200'
              }`}
              aria-label="Toggle timer"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  timerEnabled ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <input
            type="range"
            min={30}
            max={300}
            step={15}
            value={secondsPerQuestion}
            disabled={!timerEnabled}
            onChange={(e) => setSecondsPerQuestion(Number(e.target.value))}
            className={`w-full h-1.5 rounded-full ${timerEnabled ? 'accent-pink-500 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
          />
          <div className={`flex justify-between text-xs ${timerEnabled ? 'text-gray-400' : 'text-gray-300'}`}>
            <span>30s</span>
            <span>5m</span>
          </div>
        </div>
      </div>
    </div>
  )
}
