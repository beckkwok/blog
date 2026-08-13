import { ArrowUpRight, Mail } from 'lucide-react'
import React from 'react'

import { RichText } from '@/components/RichText'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAbout } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <Badge variant="secondary" className="mb-6">
        About
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About</h1>

      {!about?.name ? (
        <p className="mt-6 text-muted-foreground">About content hasn&apos;t been written yet.</p>
      ) : (
        <div className="mt-10 grid gap-10 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Avatar className="size-40 border text-3xl">
              <AvatarFallback className="bg-muted">
                {about.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {about.socialLinks && about.socialLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                {about.socialLinks.map(
                  (link, i) =>
                    link?.url && (
                      <Button key={i} asChild variant="ghost" size="sm" className="justify-start">
                        <a href={link.url} rel="noopener noreferrer" target="_blank">
                          {link.label || link.url}
                          <ArrowUpRight className="size-4" />
                        </a>
                      </Button>
                    ),
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{about.name}</h2>
              {about.tagline && (
                <p className="mt-2 text-lg text-muted-foreground">{about.tagline}</p>
              )}
            </div>

            {about.bio && (
              <div className="rich-text prose prose-neutral max-w-none dark:prose-invert">
                <RichText content={about.bio} />
              </div>
            )}

            {about.email && (
              <Card>
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">Want to talk?</p>
                    <p className="text-sm text-muted-foreground">
                      I&apos;m always happy to connect.
                    </p>
                  </div>
                  <Button asChild>
                    <a href={`mailto:${about.email}`}>
                      <Mail className="size-4" /> {about.email}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
