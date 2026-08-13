import type { MetadataRoute } from 'next'

import { getPublishedPosts } from '@/lib/site-data'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { docs: posts } = await getPublishedPosts(500)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/blogs'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blogs/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes]
}
