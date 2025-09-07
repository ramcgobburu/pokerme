import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poker Assistant - AI-Powered Poker Helper',
  description: 'Your AI-powered assistant for 5-card poker games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800">
          {children}
        </div>
      </body>
    </html>
  )
}
