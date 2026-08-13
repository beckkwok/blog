/** Central site metadata shared by SEO routes and pages. */
export const siteConfig = {
  name: 'beckk blog',
  title: 'beckk blog',
  description: "beckk's personal blog — posts, projects, and an interview bot.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'beckk',
  locale: 'en_US',
}

export function absoluteUrl(path = ''): string {
  return `${siteConfig.url}${path}`
}
