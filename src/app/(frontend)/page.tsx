import { ArrowRight, ExternalLink, FileText, FolderGit2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { lexicalToPlainText } from '@/lib/lexical'
import { extractTags, siteConfig } from '@/lib/site'
import { getAbout, getProjects, getPublishedPosts } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function HomePage() {
  const [{ docs: posts }, projects, about] = await Promise.all([
    getPublishedPosts(5),
    getProjects(5),
    getAbout(),
  ])
  const heroImage = about?.photo && typeof about.photo !== 'number' ? about.photo : null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-6">
            Welcome
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hello, I&apos;m {siteConfig.author}.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Welcome to my little corner of the knowledge database. I write about building things, and interesting knowledge .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/blogs">
                Read the blog <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>

        {heroImage?.url && (
          <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={heroImage.url}
              alt={heroImage.alt || siteConfig.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized={heroImage.url.startsWith('/api/')}
            />
          </div>
        )}
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Latest posts</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/blogs">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => {
              const cover =
                post.coverImage && typeof post.coverImage !== 'number' ? post.coverImage : null
              return (
                <Card key={post.id} className="overflow-hidden transition-colors hover:border-foreground/25">
                  {cover?.url && (
                    <Link href={`/blogs/${post.slug}`} className="block">
                      <div className="relative aspect-[16/9] w-full bg-muted">
                        <Image
                          src={cover.url}
                          alt={cover.alt || post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          unoptimized={cover.url.startsWith('/api/')}
                        />
                      </div>
                    </Link>
                  )}
                  <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {post.publishedDate && <span>{formatDate(post.publishedDate)}</span>}
                    {post.tags?.length
                      ? extractTags(post.tags)
                          .slice(0, 3)
                          .map((tag) => (
                            <Badge key={tag} variant="secondary" className="font-normal">
                              <Link href={`/blogs/tags/${encodeURIComponent(tag)}`} className="hover:underline">
                                {tag}
                              </Link>
                            </Badge>
                          ))
                      : null}
                  </div>
                  <CardTitle className="text-xl leading-snug">
                    <Link href={`/blogs/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                {post.excerpt && (
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardContent>
                )}
                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="px-0">
                    <Link href={`/blogs/${post.slug}`}>
                      Read post <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              )
            })}
          </div>
        )}
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">
              About me <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="transition-colors hover:border-foreground/25">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                {project.description && (
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3">
                      {lexicalToPlainText(project.description)}
                    </CardDescription>
                  </CardContent>
                )}
                {project.url && (
                  <CardFooter>
                    <Button asChild variant="ghost" size="sm" className="px-0">
                      <a href={project.url} rel="noopener noreferrer" target="_blank">
                        View site <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
