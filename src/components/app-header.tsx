'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { Settlement } from '@/schemas/settlement'
import type { ReactElement } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { OverviewCard } from './settlement/overview/overview-card'

/**
 * App Header Component
 *
 * @param props Settlement Form Properties
 * @returns App Header Component
 */
export function AppHeader({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center justify-start gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-12"
          />
          <h1 className="text-base text-sm">
            Kingdom Death: Monster - Recordkeeper
          </h1>
        </div>

        <OverviewCard {...form} />
      </div>
    </header>
  )
}
