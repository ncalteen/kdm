'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react'
import { ComponentProps, ReactElement } from 'react'

/**
 * Settlement Switcher Properties
 */
interface SettlementSwitcherProps extends ComponentProps<typeof Sidebar> {
  /** Campaign */
  campaign: Campaign
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Settlements */
  settlements: Settlement[]
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

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
  campaign,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  settlements,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedShowdown,
  setSelectedSurvivor
}: SettlementSwitcherProps): ReactElement {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                selectedHunt
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30'
                  : selectedShowdown
                    ? 'bg-red-500/20 hover:bg-red-500/30'
                    : ''
              }`}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>

              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {selectedSettlement?.name ?? 'Create a Settlement'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {selectedSettlement?.campaignType ?? 'Choose your destiny'}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start">
            {/* Always display the create settlement option */}
            <DropdownMenuItem
              onSelect={() => {
                setSelectedSettlement(null)
                setSelectedHunt(null)
                setSelectedShowdown(null)
                setSelectedSurvivor(null)
              }}>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create a Settlement</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Display existing settlements */}
            {settlements.map((s) => (
              <DropdownMenuItem
                key={s.id}
                onSelect={() => {
                  const settlementHunt =
                    campaign.hunts?.find(
                      (hunt) => hunt.settlementId === s.id
                    ) || null
                  const settlmentShowdown =
                    campaign.showdowns?.find(
                      (showdown) => showdown.settlementId === s.id
                    ) || null

                  setSelectedSettlement(s)
                  setSelectedHunt(settlementHunt)
                  setSelectedShowdown(settlmentShowdown)
                  setSelectedSurvivor(null)
                }}>
                <div className="flex flex-col">
                  <span>{s.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {s.campaignType}
                  </span>
                </div>
                {s && s.name === selectedSettlement?.name && (
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
