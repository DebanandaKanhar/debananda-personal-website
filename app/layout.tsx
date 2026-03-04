import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Debananda Kanhar | AI, ML & Data Science',
    template: '%s | Debananda Kanhar',
  },
  description:
    'Articles, tutorials, and insights on Artificial Intelligence, Machine Learning, AI Agents, Data Science, and personal experiences by Debananda Kanhar.',
  keywords: ['AI', 'Machine Learning', 'Data Science', 'Agents', 'Teaching', 'Computer Science'],
  authors: [{ name: 'Debananda Kanhar', url: 'https://debananda.dev' }],
  creator: 'Debananda Kanhar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Debananda Kanhar',
    title: 'Debananda Kanhar | AI, ML & Data Science',
    description: 'Articles, tutorials, and insights on AI, ML, Agents and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debananda Kanhar',
    description: 'AI, ML & Data Science articles and insights',
    creator: '@debanandakanhar',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Animated floating bg blobs */}
        <div className="animated-bg" aria-hidden="true" />

        <Header />
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
        <Footer />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#16161e',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#16161e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#16161e' },
            },
          }}
        />
      </body>
    </html>
  )
}
