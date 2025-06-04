import { Toaster } from '@/components/ui/sonner'
import { SettlementProvider } from '@/contexts/settlement-context'
import { SurvivorProvider } from '@/contexts/survivor-context'
import { TabProvider } from '@/contexts/tab-context'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactElement, ReactNode } from 'react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Kingdom Death: Monster - Tracker'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>): ReactElement {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettlementProvider settlement={null}>
          <SurvivorProvider survivor={null}>
            <TabProvider initialTab="timeline">{children}</TabProvider>
          </SurvivorProvider>
        </SettlementProvider>
        <Toaster />
      </body>
    </html>
  )
}
