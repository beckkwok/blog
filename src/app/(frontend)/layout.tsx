import { Geist_Mono, Roboto } from 'next/font/google'
import React from 'react'

import { ChatWidget } from '@/components/ChatWidget'
import { Nav } from '@/components/Nav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/lib/site'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${roboto.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <Nav />
          <main>{children}</main>
          <footer className="border-t py-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} beckk. Built with Payload CMS + Next.js.</p>
          </footer>
          <ChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
