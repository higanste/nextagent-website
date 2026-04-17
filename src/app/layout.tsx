import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NextAgent — Chat with Any Document',
  description: 'Upload PDFs, Word docs, and more. Ask questions. Get instant answers with citations. Free forever.',
  metadataBase: new URL('https://nextagent.site'),
  openGraph: {
    title: 'NextAgent — Chat with Any Document',
    description: 'Upload PDFs, Word docs, and more. Ask questions. Get instant answers with citations.',
    url: 'https://nextagent.site',
    siteName: 'NextAgent',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0a] text-[#e8e8e8] antialiased">
        {children}
      </body>
    </html>
  )
}
