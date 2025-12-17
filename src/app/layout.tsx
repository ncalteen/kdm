import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SelectedHuntProvider } from '@/contexts/selected-hunt-context'
import { SelectedSettlementProvider } from '@/contexts/selected-settlement-context'
import { SelectedShowdownProvider } from '@/contexts/selected-showdown-context'
import { SelectedSurvivorProvider } from '@/contexts/selected-survivor-context'
import { SelectedTabProvider } from '@/contexts/selected-tab-context'
import { SurvivorsProvider } from '@/contexts/survivors-context'
import { TabType } from '@/lib/enums'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactElement, ReactNode } from 'react'

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SurvivorsProvider survivors={[]}>
            <SelectedSettlementProvider settlement={null}>
              <SelectedSurvivorProvider survivor={null}>
                <SelectedHuntProvider hunt={null}>
                  <SelectedShowdownProvider showdown={null}>
                    <SelectedTabProvider tab={TabType.TIMELINE}>
                      {children}
                    </SelectedTabProvider>
                  </SelectedShowdownProvider>
                </SelectedHuntProvider>
              </SelectedSurvivorProvider>
            </SelectedSettlementProvider>
          </SurvivorsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
