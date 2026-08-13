import { NextRequest, NextResponse } from 'next/server'

import { deepseekChat, type ChatMessage } from '@/lib/deepseek'
import { hybridSearch } from '@/lib/vectorSearch'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/ask
 * Ask the "interview me" bot a question. The request is embedded, the vector
 * store is searched over the private Knowledge sources (CV, interview prep,
 * blog posts), and DeepSeek answers strictly from the retrieved context.
 *
 * The retrieved chunks are only ever used server-side — they are never
 * returned to the client.
 */
export async function POST(req: NextRequest) {
  let question: string
  try {
    const body = await req.json()
    question = typeof body?.question === 'string' ? body.question.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!question) {
    return NextResponse.json({ error: 'A non-empty "question" is required.' }, { status: 400 })
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: 'Question is too long (max 2000 characters).' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY || !process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: 'Server is not configured with the required API keys.' },
      { status: 500 },
    )
  }

  try {
    // 1. Retrieve the most relevant knowledge chunks (private, server-side only)
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })

    const matches = await hybridSearch(payload, question, { limit: 5 })

    if (matches.length === 0) {
      return NextResponse.json(
        { answer: "I don't have anything on that in my notes yet — ask me something else!" },
        { status: 200 },
      )
    }

    // 2. Build the system prompt from retrieved context
    const context = matches.map((m, i) => `[${i + 1}] ${m.content}`).join('\n\n')
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are impersonating the owner of this blog, answering questions as if you were them. ' +
          'Answer ONLY from the provided context excerpts. If the context does not contain the answer, ' +
          'say you are not sure and do not invent details. Be concise, warm, and use a first-person voice. ' +
          'Never mention that you were given context excerpts.\n\n' +
          `Context:\n${context}`,
      },
      { role: 'user', content: question },
    ]

    // 3. Generate the answer with DeepSeek
    const answer = await deepseekChat(messages)

    return NextResponse.json({ answer }, { status: 200 })
  } catch (err) {
    console.error('/api/ask error:', err)
    return NextResponse.json(
      { error: 'Failed to generate an answer. Please try again.' },
      { status: 500 },
    )
  }
}
