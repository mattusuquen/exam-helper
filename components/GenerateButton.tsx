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
        group w-full py-3.5 px-6 rounded-xl text-sm font-black transition-all duration-200
        ${disabled || isLoading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800 active:scale-[0.99]'}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          {loadingMessage}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          Generate exam questions
          <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">
            →
          </span>
        </span>
      )}
    </button>
  )
}
