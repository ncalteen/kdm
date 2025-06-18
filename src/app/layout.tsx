import { Toaster } from '@/components/ui/sonner'
import { SelectedHuntProvider } from '@/contexts/selected-hunt-context'
import { SelectedSettlementProvider } from '@/contexts/selected-settlement-context'
import { SelectedSurvivorProvider } from '@/contexts/selected-survivor-context'
import { SelectedTabProvider } from '@/contexts/selected-tab-context'
import { SurvivorsProvider } from '@/contexts/survivors-context'
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
  title: 'Kingdom Death: Monster - Record Keeper'
}

/**
 * Root Layout Component
 *
 * @param props Component Properties
 * @returns Root Layout Component
 */
export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>): ReactElement {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SurvivorsProvider survivors={[]}>
          <SelectedSettlementProvider settlement={null}>
            <SelectedSurvivorProvider survivor={null}>
              <SelectedHuntProvider hunt={null}>
                <SelectedTabProvider tab="timeline">
                  {children}
                </SelectedTabProvider>
              </SelectedHuntProvider>
            </SelectedSurvivorProvider>
          </SelectedSettlementProvider>
        </SurvivorsProvider>
        <Toaster />
      </body>
    </html>
  )
}
