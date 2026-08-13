'use client'

import { CheckCircle2, Loader2, Send } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>('idle')
  const [error, setError] = React.useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value || '',
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const msg = body?.errors?.[0]?.message || 'Submission failed.'
        throw new Error(msg)
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/50">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <h2 className="font-semibold">Thanks for reaching out!</h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          Your message has been sent. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-10 flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input type="text" id="name" name="name" required maxLength={100} autoComplete="name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input type="email" id="email" name="email" required maxLength={254} autoComplete="email" />
        </div>
      </div>

      {/* Honeypot: hidden from humans, bots tend to fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input type="text" id="subject" name="subject" maxLength={200} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" required maxLength={5000} rows={6} />
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="size-4" /> Send message
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
