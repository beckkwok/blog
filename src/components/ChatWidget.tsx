'use client'

import { Bot, MessageSquare, Send, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const updated: Message[] = [...messages, { role: 'user', content: question }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      const answer = data?.answer || data?.error || 'Something went wrong.'
      setMessages([...updated, { role: 'assistant', content: answer }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Network error. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-4 z-50 flex h-[480px] max-h-[calc(100dvh-8rem)] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border bg-background shadow-xl sm:right-6 sm:bottom-6">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">Interview bot</p>
                <p className="text-xs text-muted-foreground">Ask me anything</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div ref={listRef} className="flex flex-col gap-3 p-4">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ask me about my background, projects, or opinions — I&apos;ll answer as best I
                  can from my notes.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-xl px-3.5 py-2 text-sm whitespace-pre-wrap',
                    m.role === 'user'
                      ? 'self-end bg-primary text-primary-foreground'
                      : 'self-start border bg-muted/50',
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="self-start rounded-xl border bg-muted/50 px-3.5 py-2 text-sm text-muted-foreground italic">
                  Typing…
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Question"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
        className="fixed right-4 bottom-4 z-50 size-14 rounded-full shadow-lg sm:right-6 sm:bottom-6"
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </Button>
    </>
  )
}
