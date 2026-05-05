import { NextRequest, NextResponse } from 'next/server'
import { processAllFiles } from '@/lib/extractors'
import { generateQuestions } from '@/lib/claudeClient'
import { Difficulty } from '@/lib/types'

// Required: pdf-parse and officeparser use Node.js APIs
export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const context = (formData.get('context') as string) ?? ''
    const questionCount = Math.min(20, Math.max(1, Number(formData.get('questionCount')) || 10))
    const difficulty = ((formData.get('difficulty') as string) || 'medium') as Difficulty

    const files = formData.getAll('files') as File[]
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 })
    }

    const processed = await processAllFiles(files)

    if (processed.textBlocks.length === 0 && processed.imageBlocks.length === 0) {
      return NextResponse.json(
        { error: 'Could not extract content from the uploaded files.' },
        { status: 422 }
      )
    }

    const questions = await generateQuestions(processed, context, questionCount, difficulty)

    return NextResponse.json({ questions })
  } catch (err) {
    console.error('[/api/generate]', err)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
