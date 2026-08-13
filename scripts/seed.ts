import { config as loadEnv } from 'dotenv'
loadEnv()

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { plainTextToLexical } from '../src/lib/lexical'

/**
 * Seeds sample public content (blog posts, projects, about) and private
 * knowledge (CV + interview prep). Reuse for both testing the RAG pipeline
 * and populating the site. Idempotent: existing docs are skipped by slug/title.
 */
async function main() {
  const payload = await getPayload({ config })

  // --- Public: blog posts ---
  const now = new Date()
  const posts = [
    {
      title: 'Building a personal blog with Payload CMS',
      slug: 'building-personal-blog-payload',
      excerpt: 'How I set up a modern blog with Payload CMS, Next.js and Postgres.',
      content:
        'Payload CMS has become my go-to for content management. In this post I walk through the setup: Next.js as the frontend, Payload as the headless CMS, and Postgres with pgvector for AI-powered features like asking questions about my background.',
      published: true,
      publishedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'Payload CMS' }, { tag: 'Next.js' }, { tag: 'Postgres' }],
    },
    {
      title: 'Why I care about vector databases',
      slug: 'why-vector-databases',
      excerpt: 'A quick introduction to embeddings and similarity search.',
      content:
        'Vector databases store embeddings that let you search by meaning rather than exact keywords. With pgvector, you get this capability right inside Postgres, avoiding a separate database to operate. I use cosine similarity to power a chatbot that answers questions about my career.',
      published: true,
      publishedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'pgvector' }, { tag: 'AI' }, { tag: 'Databases' }],
    },
  ]

  for (const post of posts) {
    const exists = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: post.slug } },
      overrideAccess: true,
      depth: 0,
    })
    if (exists.totalDocs === 0) {
      await payload.create({
        collection: 'blog-posts',
        data: { ...post, content: plainTextToLexical(post.content), _status: 'published' },
        overrideAccess: true,
      })
      console.log('Created blog post:', post.slug)
    } else {
      await payload.update({
        collection: 'blog-posts',
        id: exists.docs[0].id,
        data: { ...post, content: plainTextToLexical(post.content), _status: 'published' },
        overrideAccess: true,
      })
      console.log('Updated blog post:', post.slug)
    }
  }

  // --- Public: projects ---
  const projects = [
    {
      title: 'Personal blog & interview bot',
      slug: 'blog-interview-bot',
      description:
        'This very site: a Payload CMS + Next.js blog with a RAG-powered chat that answers questions about my background using pgvector embeddings.',
      url: 'http://localhost:3000',
      repoUrl: '',
      published: true,
      publishedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      techStack: [
        { tech: 'Payload CMS' },
        { tech: 'Next.js' },
        { tech: 'pgvector' },
        { tech: 'OpenAI' },
      ],
    },
    {
      title: 'Vector search prototype',
      slug: 'vector-search-prototype',
      description:
        'A prototype exploring hybrid search — combining Postgres full-text search with pgvector cosine similarity via Reciprocal Rank Fusion.',
      url: '',
      repoUrl: '',
      published: true,
      publishedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      techStack: [{ tech: 'Postgres' }, { tech: 'pgvector' }, { tech: 'TypeScript' }],
    },
  ]

  for (const project of projects) {
    const exists = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      overrideAccess: true,
      depth: 0,
    })
    if (exists.totalDocs === 0) {
      await payload.create({
        collection: 'projects',
        data: { ...project, description: plainTextToLexical(project.description), _status: 'published' },
        overrideAccess: true,
      })
      console.log('Created project:', project.slug)
    } else {
      await payload.update({
        collection: 'projects',
        id: exists.docs[0].id,
        data: { ...project, description: plainTextToLexical(project.description), _status: 'published' },
        overrideAccess: true,
      })
      console.log('Updated project:', project.slug)
    }
  }

  // --- Public: About global ---
  const aboutExists = await payload.findGlobal({ slug: 'about', depth: 0 })
  if (!aboutExists?.name) {
    await payload.updateGlobal({
      slug: 'about',
      data: {
        name: 'beckk',
        tagline: 'Full-stack developer building with TypeScript, Next.js and Postgres.',
        bio: plainTextToLexical(
          'I am a full-stack developer focused on practical, reliable systems. I write about web development, databases, and building AI features with retrieval-augmented generation.\n\nAsk me anything through the chat widget — it answers from my CV and interview notes.',
        ),
        email: 'beckkwokuk@gmail.com',
        socialLinks: [{ label: 'GitHub', url: 'https://github.com' }],
      },
      overrideAccess: true,
    })
    console.log('Seeded About global')
  }

  // --- Private: knowledge (CV + interview prep) ---
  // Longer content exercises multi-chunk embedding via the reindex hook.
  const knowledgeDocs = [
    {
      title: 'CV — Engineering Background',
      content: [
        'I am a full-stack developer with 5 years of experience building web applications with TypeScript, React, Next.js and Node.js.',
        'I have worked at companies ranging from startups to large enterprises, shipping production systems backed by PostgreSQL. My work spans API design (REST and GraphQL), real-time features, and containerized deployments with Docker.',
        'I have deep experience with Payload CMS, including custom collections, access control, and extending the database schema with pgvector for AI features.',
        'Outside of work, I enjoy contributing to open source, writing technical blog posts, and mentoring junior engineers on their first production deployments.',
      ].join('\n\n'),
    },
    {
      title: 'Interview Prep — Career Goals',
      content: [
        'My career goal is to grow into a staff-level engineering role where I can lead complex platform initiatives and mentor other engineers.',
        'I value long-term ownership of systems, readable code, and pragmatic engineering decisions that keep maintenance costs low.',
        'I am most energized when solving hard scaling and data problems, especially at the intersection of AI and databases — for example building retrieval systems that answer questions from private knowledge.',
      ].join('\n\n'),
    },
    {
      title: 'Interview Prep — Technical Philosophy',
      content: [
        'I believe in boring, reliable technology over clever solutions. I prefer Postgres over bespoke storage, and I like to add complexity only when the problem demands it.',
        'For AI features, I think embeddings and retrieval-augmented generation belong in the same database as your other data when possible, so you avoid a separate vector database to operate.',
        'When evaluating a new tool, I ask three questions: Does it solve a real problem we have? Can my team maintain it? What is the migration cost if it fails?',
        'I prefer small, focused pull requests, automated tests, and honest code review over heroics and late-night rewrites.',
      ].join('\n\n'),
    },
  ]

  for (const k of knowledgeDocs) {
    const exists = await payload.find({
      collection: 'knowledge',
      where: { title: { equals: k.title } },
      overrideAccess: true,
      depth: 0,
    })
    if (exists.totalDocs === 0) {
      await payload.create({
        collection: 'knowledge',
        data: { ...k, _status: 'published' },
        overrideAccess: true,
      })
      console.log('Created knowledge:', k.title)
    } else {
      // Re-seed refreshes content (and re-embeds via the afterChange hook).
      await payload.update({
        collection: 'knowledge',
        id: exists.docs[0].id,
        data: { ...k, _status: 'published' },
        overrideAccess: true,
      })
      console.log('Updated knowledge:', k.title)
    }
  }

  process.exit(0)
}
main().catch((err) => {
  console.error('FAILED:', err)
  process.exit(1)
})
