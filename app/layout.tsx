import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bank Statement Converter | AI-Powered PDF to CSV/Excel',
  description: 'Convert bank statements to CSV, Excel, or AI-optimized JSON. Free trial available. Integrate with low-code platforms and AI tools for maximum efficiency.',
  keywords: ['bank statement converter', 'PDF to CSV', 'PDF to Excel', 'AI integration', 'low-code', 'Zapier', 'Make.com'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
      </body>
    </html>
  )
}
