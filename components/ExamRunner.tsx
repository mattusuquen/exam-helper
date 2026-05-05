'use client'

import { useState, useEffect, useRef } from 'react'
import { Question } from '@/lib/types'

interface Props {
  questions: Question[]
  secondsPerQuestion: number
  difficulty: string
  onGenerateNew: () => void
}

type Phase = 'ready' | 'exam' | 'done'

const LABELS = ['A', 'B', 'C', 'D'] as const

function formatTime(s: number) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem === 0 ? `${m}m` : `${m}m ${rem}s`
}

export default function ExamRunner({ questions, secondsPerQuestion, difficulty, onGenerateNew }: Props) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(questions.length).fill(null))
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion)
  const [openReview, setOpenReview] = useState<number | null>(null)
  const [slideOut, setSlideOut] = useState(false)
  const [justClicked, setJustClicked] = useState<string | null>(null)
  const [displayScore, setDisplayScore] = useState(0)

  const selectedRef = useRef<string | null>(null)
  const currentRef = useRef(0)
  const answersRef = useRef<(string | null)[]>(Array(questions.length).fill(null))
  const advancingRef = useRef(false)

  const handleSelect = (label: string) => {
    selectedRef.current = label
    setSelected(label)
    setJustClicked(label)
    setTimeout(() => setJustClicked(null), 250)
  }

  const doAdvance = () => {
    const ans = selectedRef.current
    const cur = currentRef.current
    const newAnswers = [...answersRef.current]
    newAnswers[cur] = ans
    answersRef.current = newAnswers
    setAnswers([...newAnswers])

    if (cur + 1 >= questions.length) {
      setPhase('done')
    } else {
      const next = cur + 1
      currentRef.current = next
      setCurrent(next)
      selectedRef.current = null
      setSelected(null)
      setTimeLeft(secondsPerQuestion)
    }
    advancingRef.current = false
  }

  const advance = () => {
    if (advancingRef.current) return
    advancingRef.current = true
    setSlideOut(true)
    setTimeout(() => {
      setSlideOut(false)
      doAdvance()
    }, 200)
  }

  // Countdown
  useEffect(() => {
    if (phase !== 'exam') return
    if (timeLeft <= 0) {
      advance()
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Score count-up on done
  useEffect(() => {
    if (phase !== 'done') return
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length
    if (score === 0) return
    let n = 0
    const step = Math.max(30, Math.floor(900 / score))
    const t = setInterval(() => {
      n += 1
      setDisplayScore(n)
      if (n >= score) clearInterval(t)
    }, step)
    return () => clearInterval(t)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => {
    const blank = Array(questions.length).fill(null)
    answersRef.current = blank
    currentRef.current = 0
    selectedRef.current = null
    advancingRef.current = false
    setAnswers(blank)
    setCurrent(0)
    setSelected(null)
    setTimeLeft(secondsPerQuestion)
    setDisplayScore(0)
    setOpenReview(null)
    setSlideOut(false)
    setPhase('ready')
  }

  // ── READY SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-0 animate-fade-up">
        <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center animate-score-pop">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-black tracking-tight">Ready to start?</h1>
            <p className="text-base text-gray-400">
              Once you begin, the timer starts immediately.
            </p>
          </div>

          {/* Exam metadata pills */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-up delay-150">
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 capitalize">
              {questions.length} questions
            </span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
              {formatTime(secondsPerQuestion)} per question
            </span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 capitalize">
              {difficulty}
            </span>
          </div>

          <button
            onClick={() => setPhase('exam')}
            className="group flex items-center gap-2 px-10 py-4 bg-black text-white text-base font-black rounded-2xl hover:bg-gray-800 active:scale-95 transition-all duration-150 animate-fade-up delay-200"
          >
            Start exam
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'done') {
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length
    const pct = Math.round((score / questions.length) * 100)

    return (
      <section className="flex flex-col gap-8">
        {/* Score card */}
        <div className="flex flex-col items-center gap-4 py-12 border-2 border-gray-100 rounded-2xl animate-score-pop">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Your score</p>
          <p className="text-8xl font-black text-black leading-none tabular-nums">
            {displayScore}
            <span className="text-3xl text-gray-300 font-semibold">/{questions.length}</span>
          </p>
          <p className="text-base font-semibold text-gray-400">{pct}% correct</p>

          {/* Staggered dots */}
          <div className="flex flex-wrap justify-center gap-1.5 px-10 mt-2">
            {questions.map((q, i) => (
              <div
                key={i}
                title={`Q${i + 1}: ${answers[i] === q.correctAnswer ? 'Correct' : 'Wrong'}`}
                className={`w-3 h-3 rounded-full animate-dot-pop ${
                  answers[i] === q.correctAnswer ? 'bg-pink-500' : 'bg-gray-200'
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-3 mt-4 animate-fade-up delay-300">
            <button
              onClick={restart}
              className="px-7 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-150"
            >
              Try again
            </button>
            <button
              onClick={onGenerateNew}
              className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
            >
              Generate new exam →
            </button>
          </div>
        </div>

        {/* Review answers */}
        <div className="flex flex-col gap-2 animate-fade-up delay-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Review answers
          </h3>
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const correct = userAnswer === q.correctAnswer
            const isOpen = openReview === i

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden animate-fade-up"
                style={{ animationDelay: `${250 + i * 40}ms` }}
              >
                <button
                  onClick={() => setOpenReview(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-transform duration-200 hover:scale-110 ${
                      correct ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {correct ? '✓' : '✗'}
                  </span>
                  <span className="text-sm font-semibold text-black flex-1 text-left line-clamp-1">
                    {i + 1}. {q.question}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100 animate-fade-up">
                    <div className="flex flex-col gap-1.5 pt-4">
                      {q.options.map((opt, oi) => {
                        const label = LABELS[oi]
                        const isCorrect = q.correctAnswer === label
                        const isUser = userAnswer === label

                        return (
                          <div
                            key={label}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm ${
                              isCorrect
                                ? 'border-pink-200 bg-pink-50 text-pink-900'
                                : isUser
                                ? 'border-red-200 bg-red-50 text-red-800'
                                : 'border-gray-100 text-gray-500'
                            }`}
                          >
                            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded border border-current text-[10px] font-bold opacity-60">
                              {label}
                            </span>
                            <span className="leading-relaxed">{opt.replace(/^[A-D]\.\s*/, '')}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 leading-relaxed">
                      <span className="font-bold text-black">Explanation: </span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // ── EXAM SCREEN ─────────────────────────────────────────────────────────────
  const q = questions[current]
  const timerPct = (timeLeft / secondsPerQuestion) * 100
  const progressPct = ((current + 1) / questions.length) * 100
  const timerUrgent = timeLeft <= 10

  return (
    <section className="flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mb-10">
        <span className="text-sm font-black text-gray-400">
          {current + 1}
          <span className="text-gray-300"> / </span>
          {questions.length}
        </span>

        <div className={`flex items-center gap-2 transition-colors duration-500 ${timerUrgent ? 'text-red-500' : 'text-gray-500'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-sm font-black tabular-nums ${timerUrgent ? 'animate-timer-pulse' : ''}`}>
            {String(Math.floor(timeLeft / 60)).padStart(1, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
          <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerUrgent ? 'bg-red-500' : 'bg-pink-500'}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Animated question + options */}
      <div
        key={current}
        className={slideOut ? 'animate-slide-out-left' : 'animate-slide-in-right'}
      >
        <h2 className="text-2xl font-black text-black leading-snug mb-8">
          {q.question}
        </h2>

        <div className="flex flex-col gap-3 mb-10">
          {q.options.map((opt, i) => {
            const label = LABELS[i]
            const isSelected = selected === label
            const isPopping = justClicked === label

            return (
              <button
                key={label}
                type="button"
                onClick={() => handleSelect(label)}
                className={`
                  flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 text-left
                  transition-all duration-150
                  ${isPopping ? 'animate-pop' : ''}
                  ${isSelected
                    ? 'border-pink-500 bg-pink-50 text-black scale-[1.01]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:translate-x-1 text-gray-800'}
                `}
              >
                <span
                  className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-150 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-500 text-white scale-110'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {label}
                </span>
                <span className="text-sm font-medium leading-relaxed">
                  {opt.replace(/^[A-D]\.\s*/, '')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={advance}
          className="group flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-150"
        >
          {current + 1 === questions.length ? 'Finish' : 'Next'}
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
