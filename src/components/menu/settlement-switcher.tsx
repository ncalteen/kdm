'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Settlement } from '@/schemas/settlement'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react'

/**
 * Settlement Switcher Component
 *
 * Displays a dropdown menu for switching between settlements. When the
 * currently selected settlement has an active hunt or showdown, the
 * background is highlighted in to indicate the settlement is in the
 * corresponding phase.
 *
 * @param props Settlement Switcher Properties
 * @returns Settlement Switcher Component
 */
export function SettlementSwitcher({
  settlement,
  settlements,
  setSelectedSettlement
}: {
  settlement: Settlement | null
  settlements: Settlement[]
  setSelectedSettlement?: (settlement: Settlement | null) => void
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                settlement?.activeHunt
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30'
                  : settlement?.activeShowdown
                    ? 'bg-red-500/20 hover:bg-red-500/30'
                    : ''
              }`}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {settlement?.name ?? 'Create a Settlement'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {settlement?.campaignType ?? 'Choose your destiny'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start">
            <DropdownMenuItem
              onSelect={() => {
                if (setSelectedSettlement) setSelectedSettlement(null)
              }}>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create a Settlement</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {settlements.map((s) => (
              <DropdownMenuItem
                key={s.id}
                onSelect={() => {
                  if (setSelectedSettlement) setSelectedSettlement(s)
                }}>
                <div className="flex flex-col">
                  <span>{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.campaignType}
                  </span>
                </div>
                {s && s.name === settlement?.name && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
