'use client'

interface Props {
  isLoading: boolean
  disabled: boolean
  loadingMessage: string
}

export default function GenerateButton({ isLoading, disabled, loadingMessage }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`
        w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all
        ${disabled || isLoading
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.99]'}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          {loadingMessage}
        </span>
      ) : (
        'Generate Exam Questions'
      )}
    </button>
  )
}
