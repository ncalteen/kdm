'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { MarkGithubIcon } from '@primer/octicons-react'
import { SidebarIcon } from 'lucide-react'
import Link from 'next/link'

/**
 * Site Header Component
 */
export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center justify-between border-b px-4">
      <div className="flex h-(--header-height) items-center gap-2">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <h1 className="text-base text-sm">
          Kingdom Death: Monster - Recordkeeper
        </h1>
      </div>

      <Link
        href="https://github.com/ncalteen/kdm"
        className="flex items-center gap-2 text-sm hover:underline">
        <MarkGithubIcon size={16} />
        <span>ncalteen/kdm</span>
      </Link>
    </header>
  )
}
