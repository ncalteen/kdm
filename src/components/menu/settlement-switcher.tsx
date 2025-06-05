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
import { useSettlement } from '@/contexts/settlement-context'
import { Settlement } from '@/schemas/settlement'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react'

/**
 * Settlement Switcher Component
 *
 * @param props Settlement Switcher Properties
 * @returns Settlement Switcher Component
 */
export function SettlementSwitcher({
  settlements
}: {
  settlements: Settlement[]
}) {
  const { selectedSettlement, setSelectedSettlement } = useSettlement()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {selectedSettlement?.name ?? 'Create a Settlement'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedSettlement?.campaignType ?? 'Choose your destiny'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start">
            <DropdownMenuItem onSelect={() => setSelectedSettlement(null)}>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create a Settlement</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {settlements.map((settlement) => (
              <DropdownMenuItem
                key={settlement.id}
                onSelect={() => setSelectedSettlement(settlement)}>
                <div className="flex flex-col">
                  <span>{settlement.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {settlement.campaignType}
                  </span>
                </div>
                {selectedSettlement &&
                  settlement.name === selectedSettlement.name && (
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
