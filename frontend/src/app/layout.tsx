import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PID Analyzer',
  description: 'Analyze P&ID drawings and extract elements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}