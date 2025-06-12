'use client'

import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card'
import { Survivor } from '@/schemas/survivor'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { UserCheckIcon, UserSearchIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Survivor Selection Card Props
 */
interface SurvivorSelectionCardProps extends Survivor {
  /** Survivor Selected as Scout */
  isSelectedAsScout: boolean
  /** Survivor is Disabled */
  isDisabled: boolean
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Temporary Selection State */
  tempSelection: number[]
}

/**
 * Survivor Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function SurvivorSelectionCard({
  handleSurvivorToggle,
  isSelectedAsScout,
  isDisabled,
  tempSelection,
  ...survivor
}: SurvivorSelectionCardProps): ReactElement {
  const isSelected = tempSelection.includes(survivor.id)

  return (
    <HoverCard>
      <HoverCardTrigger className="w-[195px] h-[140px]">
        <Button
          key={survivor.id}
          variant={tempSelection.includes(survivor.id) ? 'default' : 'outline'}
          className="justify-start flex flex-col h-12 p-3 w-full h-full items-start relative"
          onClick={() => handleSurvivorToggle(survivor.id)}
          disabled={isDisabled}>
          <div className="flex flex-row items-center gap-2">
            <Avatar
              className={
                'h-8 w-8 items-center justify-center' +
                (isDisabled ? ' bg-muted' : ' bg-muted/50')
              }>
              <AvatarFallback>{survivor.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Hunt XP:</strong> {survivor.huntXP}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Gender:</strong> {survivor.gender}
            </Badge>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Survival:</strong> {survivor.survival}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Insanity:</strong> {survivor.insanity}
            </Badge>
          </div>

          {isSelectedAsScout && (
            <span className="text-xs text-red-500 ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UserSearchIcon className="h-4 w-4 " />
              Scout
            </span>
          )}

          {isSelected && (
            <span className="text-xs ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UserCheckIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </HoverCardTrigger>
    </HoverCard>
  )
}
