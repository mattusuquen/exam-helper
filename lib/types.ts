export interface Question {
  question: string
  options: [string, string, string, string]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ProcessedContent {
  textBlocks: string[]
  imageBlocks: Array<{
    base64: string
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
  }>
}

export interface GenerateResponse {
  questions?: Question[]
  error?: string
}
