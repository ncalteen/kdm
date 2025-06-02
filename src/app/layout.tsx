import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { SettlementProvider } from '@/contexts/settlement-context'
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
          <TabProvider initialTab="timeline">
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    {children}
                    <footer className="text-center text-xs text-gray-500 pb-8 px-8">
                      <p>
                        This project is not affiliated with or endorsed by
                        Kingdom Death: Monster or any of its creators. It is a
                        fan-made project created for personal use and
                        entertainment purposes only. All rights to Kingdom
                        Death: Monster and its associated materials are owned by
                        their respective copyright holders. This project is
                        intended to be a tool for players to enhance their
                        experience with the game and is not intended for
                        commercial use or distribution.
                      </p>
                    </footer>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TabProvider>
        </SettlementProvider>
        <Toaster />
      </body>
    </html>
  )
}
