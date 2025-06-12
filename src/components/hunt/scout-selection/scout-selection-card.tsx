'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card'
import { Survivor } from '@/schemas/survivor'
import { UserCheckIcon, UsersIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Scout Selection Card Props
 */
interface ScoutSelectionCardProps extends Survivor {
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Survivor Selected as Scout */
  isCurrentlySelected: boolean
  /** Survivor is Selected for Hunt Party */
  isSelectedAsSurvivor: boolean
}

/**
 * Scout Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function ScoutSelectionCard({
  handleSurvivorToggle,
  isCurrentlySelected,
  isSelectedAsSurvivor,
  ...survivor
}: ScoutSelectionCardProps): ReactElement {
  return (
    <HoverCard>
      <HoverCardTrigger className="w-[195px] h-[140px]">
        <Button
          key={survivor.id}
          variant={isCurrentlySelected ? 'default' : 'outline'}
          className="justify-start flex flex-col h-12 p-3 w-full h-full items-start relative"
          onClick={() => handleSurvivorToggle(survivor.id)}
          disabled={isSelectedAsSurvivor}>
          <div className="flex flex-row items-center gap-2">
            <Avatar
              className={
                'h-8 w-8 items-center justify-center' +
                (isSelectedAsSurvivor ? ' bg-muted' : ' bg-muted/50')
              }>
              <AvatarFallback>{survivor.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isCurrentlySelected ? 'secondary' : 'default'}>
              <strong>Hunt XP:</strong> {survivor.huntXP}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isCurrentlySelected ? 'secondary' : 'default'}>
              <strong>Gender:</strong> {survivor.gender}
            </Badge>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isCurrentlySelected ? 'secondary' : 'default'}>
              <strong>Survival:</strong> {survivor.survival}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isCurrentlySelected ? 'secondary' : 'default'}>
              <strong>Insanity:</strong> {survivor.insanity}
            </Badge>
          </div>

          {isSelectedAsSurvivor && (
            <span className="text-xs text-red-500 ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UsersIcon className="h-4 w-4 " />
              Hunting Party
            </span>
          )}

          {isCurrentlySelected && (
            <span className="text-xs ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UserCheckIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </HoverCardTrigger>
    </HoverCard>
  )
}
