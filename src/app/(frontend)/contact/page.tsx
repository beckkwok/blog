import React from 'react'

import { ContactForm } from '@/components/ContactForm'
import { Badge } from '@/components/ui/badge'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <Badge variant="secondary" className="mb-6">
        Contact
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Have a question or want to work together? Send me a message and I&apos;ll get back to
        you.
      </p>
      <ContactForm />
    </div>
  )
}
