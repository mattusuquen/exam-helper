import Anthropic from '@anthropic-ai/sdk'
import { Question, Difficulty, ProcessedContent } from './types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DIFFICULTY_GUIDE: Record<Difficulty, string> = {
  easy: 'straightforward recall and basic comprehension',
  medium: 'application of concepts and moderate analysis',
  hard: 'synthesis, evaluation, and deep conceptual understanding',
}

export async function generateQuestions(
  processed: ProcessedContent,
  userContext: string,
  questionCount: number,
  difficulty: Difficulty
): Promise<Question[]> {
  const content: Anthropic.MessageParam['content'] = []

  // 1. Text blocks from PDFs and PPTXs
  if (processed.textBlocks.length > 0) {
    const combined = processed.textBlocks
      .map((t, i) => `--- Document ${i + 1} ---\n${t}`)
      .join('\n\n')
    content.push({
      type: 'text',
      text: `Extracted text from uploaded documents:\n\n${combined}`,
    })
  }

  // 2. Image blocks (PNG/JPG slides)
  for (const img of processed.imageBlocks) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType,
        data: img.base64,
      },
    })
  }

  // 3. Instruction block (last, so Claude sees all material first)
  const contextSection = userContext.trim()
    ? `\nAdditional context:\n${userContext.trim()}\n`
    : ''

  content.push({
    type: 'text',
    text: `${contextSection}
Based on all the content above, generate exactly ${questionCount} multiple-choice exam questions.
Difficulty: ${difficulty} — questions should test ${DIFFICULTY_GUIDE[difficulty]}.

Rules:
- Each question has exactly 4 options labeled A, B, C, D
- Only one option is correct
- Distractors must be plausible, not obviously wrong
- Explanation must justify the correct answer and briefly dismiss the others

Respond with ONLY a valid JSON array — no markdown fences, no prose. Schema:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "..."
  }
]`,
  })

  const max_tokens = Math.max(1024, Math.min(8192, questionCount * 500 + 500))

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens,
    system:
      'You are an expert educator and exam designer. You create rigorous, high-quality multiple-choice questions from study materials. Respond only with valid JSON — no markdown fences, no explanation outside the JSON array.',
    messages: [{ role: 'user', content }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  // Defensively strip markdown code fences if Claude adds them
  const raw = textBlock.text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let questions: Question[]
  try {
    questions = JSON.parse(raw)
  } catch {
    throw new Error(`Claude returned invalid JSON: ${raw.slice(0, 300)}`)
  }

  if (!Array.isArray(questions)) {
    throw new Error('Expected a JSON array from Claude')
  }

  return questions
}
